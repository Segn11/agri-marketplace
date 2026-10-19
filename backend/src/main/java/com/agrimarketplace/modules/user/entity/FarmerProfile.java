package com.agrimarketplace.modules.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "farmer_profiles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 200)
    private String farmName;

    @Column(nullable = false, length = 255)
    private String farmLocation;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private boolean isVerified = false;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}
