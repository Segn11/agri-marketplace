package com.agrimarketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AgriMarketplaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgriMarketplaceApplication.class, args);
    }
}
