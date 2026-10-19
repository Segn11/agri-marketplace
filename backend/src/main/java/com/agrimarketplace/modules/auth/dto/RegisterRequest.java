package com.agrimarketplace.modules.auth.dto;

import com.agrimarketplace.modules.user.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull(message = "Role is required (ROLE_FARMER or ROLE_BUYER)")
    private Role role;

    @NotBlank(message = "Location is required (e.g., City, District, Region)")
    private String location;

    // Optional fields if registering as Farmer
    private String farmName;
    private String farmLocation;
    private String farmDescription;
}
