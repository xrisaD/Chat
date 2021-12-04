package com.dtests.repositories;

import com.dtests.domain.Option;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface OptionRepository extends CrudRepository<Option, Long> {
}
