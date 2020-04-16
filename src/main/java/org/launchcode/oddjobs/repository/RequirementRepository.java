package org.launchcode.oddjobs.repository;

import org.launchcode.oddjobs.domain.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Requirement entity.
 */

@Repository
public interface RequirementRepository extends JpaRepository<Requirement, Long> {

}
