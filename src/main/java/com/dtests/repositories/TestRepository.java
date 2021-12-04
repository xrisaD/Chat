package com.dtests.repositories;

import com.dtests.domain.Test;
import com.dtests.domain.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRepository extends CrudRepository<Test, Long> {
   List<Test> findByUser(User user);
}
