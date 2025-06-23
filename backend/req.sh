curl -X POST \
http://localhost:7321/api/files/upload \
-H 'Content-Type: multipart/form-data' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhjOTNjODgzLWZiMTgtNGRhNC05NzcwLTllZjJmNjZjYjQ2ZCIsInJvbGVJZCI6IjM1MmUyNTM0LTZiZTctNDAxYi1hM2U1LWQ4YTM5NDhlMDg0MSIsImlhdCI6MTc1MDU5NjI5OCwiZXhwIjoxNzUwNjAzNDk4fQ.irhIIBHbMI9nxw91LzDCr2S8QuBwkHv8qRLSnBEv5V4' \
-F 'file=@file.txt'

# List files with search
  curl "http://localhost:7321/api/files?page=1&limit=10&search=document&permissionLevel=shared" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"

  # Upload file
curl -X POST http://localhost:7321/api/files/upload \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -F "file=@document.pdf" \
    -F "permissionLevel=shared" \
    -F "tags=[\"important\",\"project\"]"

    # ----------- AUTH CONTROLLER -----------
  
  # Register a new user
curl -X POST http://localhost:7321/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "email": "user@example.com",
      "password": "password123",
      "name": "Test User"
    }'
  
  # Login
  curl -X POST http://localhost:7321/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "user@example.com",
      "password": "password123"
    }'
  
  # ----------- USER CONTROLLER -----------
  
  # Create a user (requires JWT and permission)
  curl -X POST http://localhost:7321/api/user \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "newuser@example.com",
      "password": "password123",
      "name": "New User"
    }'
  
  # Get user by ID
  curl -X GET http://localhost:7321/api/user/USER_ID \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  
  # Update user by ID
  curl -X PATCH http://localhost:7321/api/user/USER_ID \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Updated Name"
    }'
  
  # ----------- FILE CONTROLLER -----------
  
  # Upload a file (requires JWT and permission)
  curl -X POST http://localhost:7321/api/files/upload \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -F "file=@/path/to/your/file.txt" \
    -F "name=My File" \
    -F "description=Test upload" \
    -F "permissionLevel=shared" \
    -F "tags[]=important" \
    -F "tags[]=project"
  
  # List files (with optional filters)
  curl -X GET "http://localhost:7321/api/files?page=1&limit=10&search=document&tags[]=important&permissionLevel=shared" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhjOTNjODgzLWZiMTgtNGRhNC05NzcwLTllZjJmNjZjYjQ2ZCIsInJvbGVJZCI6IjM1MmUyNTM0LTZiZTctNDAxYi1hM2U1LWQ4YTM5NDhlMDg0MSIsImlhdCI6MTc1MDYzNDA1MCwiZXhwIjoxNzUwNjQxMjUwfQ.XhghwlejL4NwRoNmzGlqPkt4CrRyZwlN0bXGgPiC_jc"
  
  # Get file by ID
  curl -X GET http://localhost:7321/api/files/4768f36f-ed3f-4eba-9d95-2aa961945df3 \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhjOTNjODgzLWZiMTgtNGRhNC05NzcwLTllZjJmNjZjYjQ2ZCIsInJvbGVJZCI6IjM1MmUyNTM0LTZiZTctNDAxYi1hM2U1LWQ4YTM5NDhlMDg0MSIsImlhdCI6MTc1MDYzNDA1MCwiZXhwIjoxNzUwNjQxMjUwfQ.XhghwlejL4NwRoNmzGlqPkt4CrRyZwlN0bXGgPiC_jc"
  
  # Update file by ID
  curl -X PATCH http://localhost:7321/api/files/FILE_ID \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Updated File Name",
      "description": "Updated description",
      "permissionLevel": "private",
      "tags": ["updated", "tag"]
    }'
  
  # ----------- AUDIT CONTROLLER -----------
  
  # List all audit logs
  curl -X GET http://localhost:7321/api/audit \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"