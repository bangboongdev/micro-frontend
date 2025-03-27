Quan-ly-chi-phi-FE
===============
docker build --no-cache -t quan_ly_xe_fe:latest .


# run container (for production)
docker-compose -f docker-compose.yaml up -d'


// Build lại docker
docker-compose up -d --build
Xóa images cũ
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
docker image prune -a