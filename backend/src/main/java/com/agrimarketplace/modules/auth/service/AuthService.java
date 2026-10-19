package com.agrimarketplace.modules.auth.service;

import com.agrimarketplace.common.exception.BadRequestException;
import com.agrimarketplace.modules.auth.dto.AuthResponse;
import com.agrimarketplace.modules.auth.dto.LoginRequest;
import com.agrimarketplace.modules.auth.dto.RegisterRequest;
import com.agrimarketplace.modules.user.entity.FarmerProfile;
import com.agrimarketplace.modules.user.entity.Role;
import com.agrimarketplace.modules.user.entity.User;
import com.agrimarketplace.modules.user.repository.FarmerProfileRepository;
import com.agrimarketplace.modules.user.repository.UserRepository;
import com.agrimarketplace.security.JwtTokenProvider;
import com.agrimarketplace.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number is already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .location(request.getLocation())
                .status("ACTIVE")
                .build();

        User savedUser = userRepository.save(user);

        if (request.getRole() == Role.ROLE_FARMER) {
            FarmerProfile profile = FarmerProfile.builder()
                    .user(savedUser)
                    .farmName(request.getFarmName() != null ? request.getFarmName() : request.getFullName() + "'s Farm")
                    .farmLocation(request.getFarmLocation() != null ? request.getFarmLocation() : request.getLocation())
                    .description(request.getFarmDescription())
                    .isVerified(false)
                    .build();
            farmerProfileRepository.save(profile);
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .role(savedUser.getRole().name())
                .location(savedUser.getLocation())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .userId(principal.getId())
                .fullName(principal.getFullName())
                .email(principal.getEmail())
                .phone(principal.getPhone())
                .role(principal.getAuthorities().iterator().next().getAuthority())
                .build();
    }
}
