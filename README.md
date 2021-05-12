# iCommerce


# Start rabbitmq
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management


curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" -d @data/product_insert.json "http://localhost:3080/products"

curl -X DELETE --header "Content-Type: application/json" --header "Accept: application/json" -d @data/product_delete.json "http://localhost:3080/products"

curl -X GET --header 'Accept: application/json' 'http://localhost:3080/products'
curl -X GET --header 'Accept: application/json' 'http://localhost:3080/products?name=name1'
curl -X GET --header 'Accept: application/json' 'http://localhost:3080/products?name=eq:name1'
curl -X GET --header 'Accept: application/json' 'http://localhost:3080/products?price=gte:10&sort_by=-price'

curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" -d @data/checkout_send.json "http://localhost:3080/checkout"

curl -X GET --header 'Accept: application/json' 'http://localhost:3080/payments'
curl -X GET --header 'Accept: application/json' 'http://localhost:3080/payments?productName=4'
curl -X GET --header 'Accept: application/json' 'http://localhost:3080/payments?productName=5&sort_by=-price'

curl -X DELETE --header "Content-Type: application/json" --header "Accept: application/json" -d @data/checkout_delete.json "http://localhost:3080/payments"
