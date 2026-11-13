// Satu-satunya tempat memanggil service ML
export async function callMlService(endpoint: string, payload: any) {
  const mlServiceUrl = process.env.ML_SERVICE_URL;
  // TODO: implement call to ML FastAPI service
}
