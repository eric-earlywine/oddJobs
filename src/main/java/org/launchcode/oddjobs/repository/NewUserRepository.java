package org.launchcode.oddjobs.repository;

import org.launchcode.oddjobs.domain.NewUser;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the NewUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NewUserRepository extends JpaRepository<NewUser, Long> {

}
