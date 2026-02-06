# User Guide: Product Reviews & Ratings

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Target Audience:** End Users  
**Related Documents:** [USER_03_SHOPPING_GUIDE.md](USER_03_SHOPPING_GUIDE.md)

---

## Overview

Share your shopping experience! Write reviews, rate products, and help other shoppers make informed decisions.

### Review Features

- ⭐ **5-Star Rating System**: Rate products 1-5 stars
- ✍️ **Written Reviews**: Share detailed feedback
- ✅ **Verified Purchase**: Reviews from actual buyers highlighted
- 👍 **Helpful Votes**: Mark reviews as helpful
- 🛡️ **Moderation**: Reviews approved before publishing

---

## Writing a Review

### Requirements

**You must:**
- Be logged in
- Have purchased the product (for verified badge)
- Not have reviewed it before

### Steps to Review

**1. Navigate to Product Details**
- Click on any product you've purchased

**2. Scroll to Reviews Section**
- Click "Write a Review" button

**3. Rate the Product**
```
★★★★★  (Click stars to rate)
```

**4. Write Your Review**
```
┌─────────────────────────────────────┐
│ Write your review...                │
│ (Minimum 10 characters)             │
│                                     │
│ Share your experience with this     │
│ product. What did you like? What    │
│ could be improved?                  │
│                                     │
│ [Submit Review]                     │
└─────────────────────────────────────┘
```

**5. Submit**
- Review submitted for approval
- Appears on product page within 24 hours

### Review Guidelines

**Character Limits:**
- Minimum: 10 characters
- Maximum: 1,000 characters

**Do's:**
- ✅ Be honest and specific
- ✅ Mention product quality
- ✅ Describe your experience
- ✅ Be respectful

**Don'ts:**
- ❌ Use offensive language
- ❌ Include personal information
- ❌ Post fake reviews
- ❌ Spam or advertise

---

## Viewing Reviews

### Product Reviews Section

```
┌─────────────────────────────────────────────────────────────┐
│  Customer Reviews                                           │
│  ★★★★☆ 4.3 out of 5  (127 reviews)                         │
├─────────────────────────────────────────────────────────────┤
│  Rating Breakdown:                                          │
│  5 ★  ████████████████████████░░ 75 (59%)                   │
│  4 ★  ████████░░░░░░░░░░░░░░░░░░ 30 (24%)                   │
│  3 ★  ███░░░░░░░░░░░░░░░░░░░░░░░ 12 (9%)                    │
│  2 ★  ██░░░░░░░░░░░░░░░░░░░░░░░░ 7 (6%)                     │
│  1 ★  █░░░░░░░░░░░░░░░░░░░░░░░░░ 3 (2%)                     │
│                                                             │
│  [Write a Review]  [Sort by: Most Recent ▼]                 │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ★★★★★  John D.  ✓ Verified Purchase                 │  │
│  │ Feb 1, 2026                                          │  │
│  │                                                      │  │
│  │ "Excellent quality! Fresh and delivered on time.    │  │
│  │  Highly recommend."                                  │  │
│  │                                                      │  │
│  │ Was this helpful? [Yes (12)] [No (1)]                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Sorting Options

- **Most Recent**: Newest reviews first
- **Most Helpful**: Highest helpful votes
- **Highest Rating**: 5-star reviews first
- **Lowest Rating**: 1-star reviews first

### Filtering Reviews

- All ratings
- 5 stars only
- 4 stars and above
- 3 stars and below
- Verified purchases only

---

## Managing Your Reviews

### Edit Review

**Steps:**
1. Go to "My Account" → "My Reviews"
2. Find your review
3. Click "Edit"
4. Modify rating/comment
5. Click "Update Review"

**Note:** Reviews reset approval status after editing.

### Delete Review

**Steps:**
1. Go to "My Reviews"
2. Click "Delete" on review
3. Confirm deletion

**Warning:** This action cannot be undone.

### View All Your Reviews

Access from: **Account** → **My Reviews**

```
┌─────────────────────────────────────────────────────────────┐
│  My Reviews (5 reviews)                                     │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Fresh Apples    ★★★★★  Approved                      │  │
│  │ Feb 1, 2026                                          │  │
│  │ "Excellent quality..."                               │  │
│  │ [Edit] [Delete]                                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Verified Purchase Badge

### What It Means

- ✅ **Verified Purchase**: Reviewer bought the product from QuickCart
- Builds trust and credibility
- Automatically added if you purchased the product

### How It Works

```python
# Backend: Check if user purchased product
purchase_query = """
    SELECT COUNT(*) as purchase_count
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE oi.product_id = %s 
    AND o.user_id = %s 
    AND o.status = 'delivered'
"""
verified = purchase_count > 0
```

---

## Helpful Votes

### Mark Reviews Helpful

- Click "Yes" if review helped you
- Click "No" if not helpful
- Total helpful votes displayed

**Purpose:** Helps surface most useful reviews.

---

## Review Moderation

### Approval Process

**Status Flow:**
```
Submit Review → Pending → Approved/Rejected
```

**Timeline:**
- Reviews approved within 24 hours
- Rejected reviews with reason notification

### Rejection Reasons

- Inappropriate language
- Spam or advertising
- Off-topic content
- Duplicate review
- Violates guidelines

---

## API Reference

```javascript
// Add review
POST /api/reviews/product/:productId
Body: {
  rating: 5,
  comment: "Great product!"
}

// Get product reviews
GET /api/reviews/product/:productId
Response: {
  reviews: [...],
  stats: {
    average_rating: 4.3,
    total_reviews: 127
  }
}
```

---

**Related Documentation:**
- [USER_03_SHOPPING_GUIDE.md](USER_03_SHOPPING_GUIDE.md)
- [USER_08_ACCOUNT_MANAGEMENT.md](USER_08_ACCOUNT_MANAGEMENT.md)
