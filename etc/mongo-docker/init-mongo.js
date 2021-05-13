db.createUser(
{
	user: "admin",
	pwd: "admin",
	roles: [
		{
			role: "readWrite",
			db: "my-mongo-db"
		}
	]
}
)