package org.launchcode.oddjobs.domain;

public class Data {
    private Job job;
    private Requirement[] jobReqs;
    private Tag[] tags;

    public Data() {}
    public Data(Job job, Requirement[] jobReqs, Tag[] tags) {
        this.job = job;
        this.jobReqs = jobReqs;
        this.tags = tags;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public Requirement[] getJobReqs() {
        return jobReqs;
    }

    public void setJobReqs(Requirement[] jobReqs) {
        this.jobReqs = jobReqs;
    }

    public Tag[] getTags() {
        return tags;
    }

    public void setTags(Tag[] tags) {
        this.tags = tags;
    }
}
