package org.launchcode.oddjobs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;

/**
 * A Requirement.
 */
@Entity
@Table(name = "requirement")
public class Requirement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "requirement_name")
    private String requirementName;

    @ManyToOne
    @JsonIgnoreProperties("requirements")
    @JsonIgnore
    private Job job;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRequirementName() {
        return requirementName;
    }

    public Requirement requirementName(String requirementName) {
        this.requirementName = requirementName;
        return this;
    }

    public void setRequirementName(String requirementName) {
        this.requirementName = requirementName;
    }

    public Job getJob() {
        return job;
    }

    public Requirement job(Job job) {
        this.job = job;
        return this;
    }

    public void setJob(Job job) {
        this.job = job;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Requirement)) {
            return false;
        }
        return id != null && id.equals(((Requirement) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Requirement{" +
            "id=" + id +
            ", requirementName='" + requirementName + '\'' +
            '}';
    }
}
