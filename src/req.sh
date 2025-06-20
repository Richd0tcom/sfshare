curl -X POST \
http://localhost:7321/api/files/upload \
-H 'Content-Type: multipart/form-data' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhNGQyNzAyLTI2ZDEtNDJlOC05YTdmLTVkM2ZmMjgwOGI0MyIsImVtYWlsIjoicmljaEBnbWFpbC5jb20iLCJyb2xlX2lkIjoiZjVmYzRiYjgtODUxZC00Y2U1LTk3NmMtOWJkYjFiYmIzM2ZmIiwiaWF0IjoxNzUwNDMwNzYwfQ.RwK83nfLbNakF2itQ4R1mVeKCiJlC6oJhnWcSt6Jsq4' \
-F 'file=@file.txt'