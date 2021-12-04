package com.dtests;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication
public class DTestsApplication {

    public static void main(String[] args) {
        SpringApplication.run(DTestsApplication.class, args);
    }

}
