package com.project.supershop.features.rating.repositories;

import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.rating.domain.entities.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RatingRepository extends JpaRepository<Rating, UUID> {
    @Query(value = "SELECT ra FROM Rating ra " +
            "WHERE ra.product.id = :productId " +
            "AND (:ratingStar <= 0 OR ra.ratingStar = :ratingStar) " +
            "AND (:withPhoto = false OR ra.feedbackImages IS NOT EMPTY) " +
            "AND (:withComment = false OR " +
            "(ra.trueDescription IS NOT NULL OR ra.comment IS NOT NULL OR ra.productQuality IS NOT NULL))",
            countQuery = "SELECT COUNT(ra) FROM Rating ra " +
                    "WHERE ra.product.id = :productId " +
                    "AND (:ratingStar <= 0 OR ra.ratingStar = :ratingStar) " +
                    "AND (:withPhoto = false OR ra.feedbackImages IS NOT EMPTY) " +
                    "AND (:withComment = false OR " +
                    "(ra.trueDescription IS NOT NULL OR ra.comment IS NOT NULL OR ra.productQuality IS NOT NULL))")
    Page<Rating> findListRatingForUser(
            Pageable pageable,
            @Param("productId") UUID productId,
            @Param("ratingStar") Integer ratingStar,
            @Param("withPhoto") Boolean withPhoto,
            @Param("withComment") Boolean withComment
    );

    @Query("SELECT COUNT(ra) FROM Rating ra WHERE ra.ratingStar = 5")
    int countRatingStar5();
    @Query("SELECT COUNT(ra) FROM Rating ra WHERE ra.ratingStar = 4")
    int countRatingStar4();
    @Query("SELECT COUNT(ra) FROM Rating ra WHERE ra.ratingStar = 3")
    int countRatingStar3();
    @Query("SELECT COUNT(ra) FROM Rating ra WHERE ra.ratingStar = 2")
    int countRatingStar2();
    @Query("SELECT COUNT(ra) FROM Rating ra WHERE ra.ratingStar = 1")
    int countRatingStar1();

    @Query("SELECT COUNT(ra) FROM Rating ra WHERE ra.feedbackImages IS NOT EMPTY")
    int countWithPhoto();
    @Query("SELECT COUNT(ra) FROM Rating ra WHERE ra.trueDescription IS NOT NULL OR ra.comment IS NOT NULL OR ra.productQuality IS NOT NULL")
    int countWithComment();
}
