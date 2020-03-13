package org.launchcode.oddjobs.repository;

import org.launchcode.oddjobs.domain.UserDetails;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the UserDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserDetailsRepository extends JpaRepository<UserDetails, Long> {

}
