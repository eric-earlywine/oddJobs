package org.launchcode.oddjobs.domain;


import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A NewUser.
 */
@Entity
@Table(name = "new_user")
public class NewUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "email")
    private String email;

    @OneToOne
    @JoinColumn(unique = true)
    private UserDetails userDetails;

    @OneToMany(mappedBy = "newUser")
    private Set<Job> jobs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public NewUser username(String username) {
        this.username = username;
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public NewUser password(String password) {
        this.password = password;
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public NewUser email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserDetails getUserDetails() {
        return userDetails;
    }

    public NewUser userDetails(UserDetails userDetails) {
        this.userDetails = userDetails;
        return this;
    }

    public void setUserDetails(UserDetails userDetails) {
        this.userDetails = userDetails;
    }

    public Set<Job> getJobs() {
        return jobs;
    }

    public NewUser jobs(Set<Job> jobs) {
        this.jobs = jobs;
        return this;
    }

    public NewUser addJob(Job job) {
        this.jobs.add(job);
        job.setNewUser(this);
        return this;
    }

    public NewUser removeJob(Job job) {
        this.jobs.remove(job);
        job.setNewUser(null);
        return this;
    }

    public void setJobs(Set<Job> jobs) {
        this.jobs = jobs;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NewUser)) {
            return false;
        }
        return id != null && id.equals(((NewUser) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "NewUser{" +
            "id=" + getId() +
            ", username='" + getUsername() + "'" +
            ", password='" + getPassword() + "'" +
            ", email='" + getEmail() + "'" +
            "}";
    }
}
