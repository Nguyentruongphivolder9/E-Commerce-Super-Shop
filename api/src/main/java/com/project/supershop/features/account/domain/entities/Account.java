package com.project.supershop.features.account.domain.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.utils.enums.Provider;
import com.project.supershop.features.auth.domain.entities.AccessToken;
import com.project.supershop.features.chat.models.Conversation;
import com.project.supershop.features.chat.models.Message;
import com.project.supershop.features.social.models.AccountPostLike;
import com.project.supershop.features.social.models.Post;
import com.project.supershop.features.social.models.SavePost;
import com.project.supershop.features.voucher.domain.entities.Voucher;
import com.project.supershop.features.voucher.domain.entities.VoucherUsed;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "accounts")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Account extends BaseEntity {
    private String userName;
    private String password;
    private String avatarUrl;
    @Pattern(regexp = "ADMIN|USER|SELLER")
    private String roleName;
    private String fullName;
    private String email;
    private String phoneNumber;
    private LocalDateTime birthDay;
    private String gender;
    private Boolean isActive;
    private Boolean isLoggedOut;
    private Boolean isEnable;
    // Cho phép gợp account
    private Boolean isMerege = true;
    //Số lần cho phép thay đổi Full name (max = 2)
    private int userFullNameChanges = 2;
    //Phương thức user đã dùng để đăng nhâp
    private String provider;

    public Account(String roles, String name, String email, String id) {
        this.roleName = roles;
        this.userName = name;
        this.email = email;
        this.setId(UUID.fromString(id));
    }

//
//    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    @JoinTable(
//            name = "account_address",
//            joinColumns = @JoinColumn(name = "account_id"),
//            inverseJoinColumns = @JoinColumn(name = "address_id")
//    )

//    private Set<Address> addresses = new HashSet<>();

    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<AccessToken> accessTokens = new HashSet<>();


    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<AccountDevice> accountDevices = new HashSet<>();

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Voucher> vouchers;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<VoucherUsed> vouchersUsed;


    //Chat feature

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonIgnore
    private List<Conversation> conversations;

//    @OneToMany(mappedBy = "seen",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    @JsonIgnore
//    private List<Message> seenMessages;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonIgnore
    private List<Message> messages;

    //Social feature
    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Post> posts;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<SavePost> savedPosts;

    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<AccountPostLike> liked;

    private String bio;

    public void addAccessToken(AccessToken accessToken) {
        if (accessToken == null) {
            return;
        }
        if (this.accessTokens == null) {
            this.accessTokens = new HashSet<>();
        }
        if (!this.accessTokens.contains(accessToken)) {
            accessToken.setAccount(this);
        }
    }

}
