package com.dtests;

import com.dtests.domain.Role;
import com.dtests.domain.Test;
import com.dtests.domain.User;
import com.dtests.repositories.QuestionRepository;
import com.dtests.repositories.RoleRepository;
import com.dtests.repositories.TestRepository;
import com.dtests.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TestRepository testRepository;
    private final QuestionRepository questionRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public DatabaseLoader(RoleRepository roleRepository, TestRepository testRepository, UserRepository userRepository, QuestionRepository questionRepository) {
        this.roleRepository = roleRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.testRepository = testRepository;
    }

    @Override
    public void run(String... strings) throws Exception {
        Role role1 = new Role("teacher");
        roleRepository.save(role1);
        User user = new User("chrysa", "123", role1);
        userRepository.save(user);

        testRepository.save(new Test("Astronomy",null, user));
        testRepository.save(new Test("Swedish",null, user));
        SecurityContextHolder.clearContext();
    }
}
