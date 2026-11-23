import { ReservationForm } from "@/features/website/reserve/components/ReservationForm";
import { ReservationHero } from "@/features/website/reserve/components/ReservationHero";

export function ReservePage() {
  return (
    <>
      <ReservationHero />
      <ReservationForm />
    </>
  );
}
