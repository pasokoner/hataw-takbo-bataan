import { api } from "../../../utils/api";

import { useRouter } from "next/router";

import RegistrationForm from "../../../components/RegistrationForm";
import ScreenContainer from "../../../layouts/ScreenContainer";

const Register = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const { data: eventData, isLoading } = api.event.details.useQuery({
    eventId: eventId as string,
  });

  if (isLoading) {
    return <></>;
  }

  if (!eventData) {
    return (
      <div className="mx-auto py-6 md:pt-12">
        <p className="text-3xl">Event not found!</p>
      </div>
    );
  }

  if (
    eventData.raceFinished10km &&
    eventData.raceFinished5km &&
    eventData.raceFinished3km &&
    eventData.closeRegistration
  ) {
    return (
      <ScreenContainer>
        <div
          className="mt-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <p className="font-bold">Event Notice!</p>
          <span className="block sm:inline">Event has already ended</span>
        </div>
      </ScreenContainer>
    );
  }

  if (eventData.closeRegistration) {
    return (
      <ScreenContainer>
        <div
          className="mt-6 rounded border border-red-400 bg-red-100 py-3 px-4 text-red-700"
          role="alert"
        >
          <p className="font-bold">Event Notice!</p>
          <span className="block sm:inline">
            Registration has already ended
          </span>
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="py-6">
      {/* <Title value={`${eventData.name} Registration`} /> */}
      <h3 className="mb-4 text-xl font-medium uppercase">
        {eventData.name} Registration Form
      </h3>
      <RegistrationForm eventId={eventData.id} eventName={eventData.name} />
    </ScreenContainer>
  );
};

export default Register;
