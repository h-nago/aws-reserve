# Set up
```
$ cp .env.default .env
$ docker-compose run --rm aws-reserve yarn
```

# Ussage
## EC2
2019-02-01以降で不足するリザーブドインスタンス
```
$ docker-compose run --rm aws-reserve node ec2.js 2019-02-01
```

## RDS
2019-02-01以降で不足するリザーブドインスタンス
```
$ docker-compose run --rm aws-reserve node rds.js 2019-02-01
```
