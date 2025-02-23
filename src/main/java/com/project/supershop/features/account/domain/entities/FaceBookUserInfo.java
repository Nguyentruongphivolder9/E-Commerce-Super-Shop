package com.project.supershop.features.account.domain.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaceBookUserInfo {

    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("email")
    private String email;

    @JsonProperty("gender")
    private String gender;

    @JsonProperty("birthday")
    private String birthday;

    @JsonProperty("location")
    private Location location;

    @JsonProperty("hometown")
    private Hometown hometown;

    @JsonProperty("picture")
    private Picture picture;

    // Inner classes to match nested JSON objects
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Location {
        @JsonProperty("name")
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Hometown {
        @JsonProperty("name")
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Picture {
        @JsonProperty("data")
        private PictureData data;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PictureData {
        @JsonProperty("url")
        private String url;
    }
}
