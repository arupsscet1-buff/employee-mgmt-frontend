# Employee Management Frontend

A small React + Vite implementation of the frontend functionality from `sunnysinghssvk/spring-boot-react-js`.

The original project uses Create React App, Axios, Reactstrap and Toastify. This version keeps the same backend contract and CRUD functionality but removes those unnecessary frontend dependencies so the DevSecOps pipeline has a much smaller dependency tree.

## Backend API

Default backend base URL:

`http://localhost:8080/developer`

Endpoints used:

- `GET /getAllDeveloper?pageNumber=0&pageSize=8`
- `POST /create`
- `PUT /update`
- `DELETE /deleteById/{id}`

Set `VITE_API_URL` for another environment.

## Local development

```bash
npm install
npm run lint
npm test
npm run build
npm run dev
```

## CI

Commit the generated `package-lock.json` after the first `npm install`, then use `npm ci` in GitHub Actions.
