import { Suspense } from "react";
import ResetPassword from "./ResetPassword";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Cargando...</p>}>
      <ResetPassword />
    </Suspense>
  );
}
