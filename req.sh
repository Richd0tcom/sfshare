curl -X POST \
http://localhost:7321/api/files/upload \
-H 'Content-Type: multipart/form-data' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhNGQyNzAyLTI2ZDEtNDJlOC05YTdmLTVkM2ZmMjgwOGI0MyIsImVtYWlsIjoicmljaEBnbWFpbC5jb20iLCJyb2xlX2lkIjoiZjVmYzRiYjgtODUxZC00Y2U1LTk3NmMtOWJkYjFiYmIzM2ZmIiwiaWF0IjoxNzUwNDMwNzYwfQ.RwK83nfLbNakF2itQ4R1mVeKCiJlC6oJhnWcSt6Jsq4' \
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