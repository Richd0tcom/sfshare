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