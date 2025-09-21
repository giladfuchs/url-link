# URL-LINK 

A modern, self-hosted URL shortener with analytics.  <br/> Create and manage links, generate QR codes, and view detailed statistics on clicks, referrers, devices, and locations.
<br/>
Built with Next.js 15, FastAPI (with background tasks), PostgreSQL, and Google Authentication.


---

##  Live Preview
Try URL-LINK in action:

- [🌐 Frontend Demo ](https://my.url-link.org/en) – create, manage, and track short links
- [⚙️ Backend API Docs  ](https://url-link.org/docs) – explore the FastAPI-powered endpoints



---

## Getting Started (Local Development / Self-Hosting)

Prerequisites
- Node.js 20+, pnpm
- Python 3.11+
- PostgreSQL 17+ (local or Docker)
- Google OAuth credentials (Client ID and Secret)


Create .env in both frontend-next/ and backend-fastapi/ using this example as a guide.

### frontend-next
```bash
NEXT_PUBLIC_SITE_NAME=URL-LINK
NEXT_PUBLIC_BASE_URL=https://my.url-link.org
NEXT_PUBLIC_API_URL=https://url-link.org
NEXT_PUBLIC_FOOTER_DATA=contact@email.com

# optional for frontend (GA4 + GSC)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_site_verification_token
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
```
### backend-fastapi
```bash
DATABASE_URL=postgresql+psycopg://admin:admin@localhost:5437/postgres
BASE_URL=http://localhost:5007
FRONTEND_URL=http://localhost:5555

JWT_SECRET=change-me
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Run Next.js 15 Frontend 

```bash
cd frontend-next
pnpm install
pnpm start
```

### Run Python backend 
Start PostgreSQL (Docker option)
```bash
docker run --name url-link-pg -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -p 5437:5432 \
 -v postgres_data_url:/var/lib/postgresql/data -d postgres:17
```

Start Backend (FastAPI)
```bash
cd backend-fastapi
#install
python -m venv venv
source venv/bin/activate   # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
#run
python debug.py   # or: uvicorn main:app --reload

```

### Optional: Mock Data
Seed fake users, links, and visit stats with [`create_fake_data.py`](backend-fastapi/data/create_fake_data.py) 
It can also reset and create tables if you just want a clean schema.
 


### Optional — GeoIP (MaxMind GeoLite)

Used to enrich visits with country/region/city data. The repository includes a helper script
: [`download_GeoLite.sh`](backend-fastapi/data/download_GeoLite.sh) (contains full instructions).
 

---

## 🤝 Contributing

Contributions are welcome!  
If you find this project useful, consider giving it a ⭐ on GitHub — it helps others discover it!

To contribute, fork the repository and submit a pull request with your enhancements or bug fixes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
