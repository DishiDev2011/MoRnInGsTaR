# Database Architecture

## Overview
This documentation outlines the comprehensive database schema and architecture for the MoRnInGsTaR project. The database is designed to support the application's functionality and features while ensuring data integrity, scalability, and performance.

## Database Schema

### Entity-Relationship Diagram (ERD)
![ERD](link-to-erd-image)

### Tables

1. **Users**  
   - **user_id** (PK, INT): Unique identifier for each user  
   - **username** (VARCHAR): Username of the user  
   - **email** (VARCHAR): Email address of the user  
   - **created_at** (DATETIME): Timestamp of user creation
   
2. **Posts**  
   - **post_id** (PK, INT): Unique identifier for each post  
   - **user_id** (FK, INT): Identifier for the user who created the post  
   - **content** (TEXT): Content of the post  
   - **created_at** (DATETIME): Timestamp of post creation  
   
3. **Comments**  
   - **comment_id** (PK, INT): Unique identifier for each comment  
   - **post_id** (FK, INT): Identifier for the related post  
   - **user_id** (FK, INT): Identifier for the user who made the comment  
   - **content** (TEXT): Content of the comment  
   - **created_at** (DATETIME): Timestamp of comment creation  
   
### Relationships
- **Users** to **Posts**: One-to-Many  
- **Posts** to **Comments**: One-to-Many

## Indexing Strategy
- **User Indexes**: Index on `email` for quick lookups.  
- **Post Indexes**: Index on `created_at` for efficient sorting.

## Backup and Recovery Plans
- Regular backups will be taken daily and stored securely.  
- Recovery measures are in place to restore the database within acceptable downtime limits.

## Conclusion
This document serves as a foundational guide for developers and database administrators to understand the database architecture of the MoRnInGsTaR application. Regular updates and reviews will be conducted to ensure the schema evolves with project requirements.