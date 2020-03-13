package org.launchcode.oddjobs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import java.io.Serializable;

/**
 * A UserDetails.
 */
@Entity
@Table(name = "user_details")
public class UserDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "description")
    private String description;

    @Column(name = "rating")
    private String rating;

    @Column(name = "job_postings")
    private Integer jobPostings;

    @Column(name = "job_completions")
    private Integer jobCompletions;

    @OneToOne(mappedBy = "userDetails")
    @JsonIgnore
    private NewUser newUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public UserDetails profilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
        return this;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getDescription() {
        return description;
    }

    public UserDetails description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRating() {
        return rating;
    }

    public UserDetails rating(String rating) {
        this.rating = rating;
        return this;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public Integer getJobPostings() {
        return jobPostings;
    }

    public UserDetails jobPostings(Integer jobPostings) {
        this.jobPostings = jobPostings;
        return this;
    }

    public void setJobPostings(Integer jobPostings) {
        this.jobPostings = jobPostings;
    }

    public Integer getJobCompletions() {
        return jobCompletions;
    }

    public UserDetails jobCompletions(Integer jobCompletions) {
        this.jobCompletions = jobCompletions;
        return this;
    }

    public void setJobCompletions(Integer jobCompletions) {
        this.jobCompletions = jobCompletions;
    }

    public NewUser getNewUser() {
        return newUser;
    }

    public UserDetails newUser(NewUser newUser) {
        this.newUser = newUser;
        return this;
    }

    public void setNewUser(NewUser newUser) {
        this.newUser = newUser;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserDetails)) {
            return false;
        }
        return id != null && id.equals(((UserDetails) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "UserDetails{" +
            "id=" + getId() +
            ", profilePicture='" + getProfilePicture() + "'" +
            ", description='" + getDescription() + "'" +
            ", rating='" + getRating() + "'" +
            ", jobPostings=" + getJobPostings() +
            ", jobCompletions=" + getJobCompletions() +
            "}";
    }
}
