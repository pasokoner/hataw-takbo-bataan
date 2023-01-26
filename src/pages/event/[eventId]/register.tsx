import RegistrationForm from "../../../components/RegistrationForm";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import Title from "../../../components/Title";
import ScreenContainer from "../../../layouts/ScreenContainer";

const Register = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const { data: eventData, isLoading } = api.event.details.useQuery({
    eventId: eventId as string,
    includeKM: false,
  });

  // const { data: participantData } = api.participant.getAll.useQuery({
  //   eventId: eventId as string,
  // });

  // if (participantData) {
  //   console.log(
  //     participantData.filter(({ _count }) => _count.kilometers === 0)
  //   );
  // }

  if (isLoading) {
    return <></>;
  }

  if (!eventData) {
    return (
      <div className="mx-auto pt-6 md:pt-12">
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
      <ScreenContainer className="mx-auto px-8 md:px-16">
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
      <ScreenContainer className="mx-auto px-8 md:px-16">
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
    <ScreenContainer className="mx-auto px-8 md:px-16">
      <div className="px-4 pt-6 pb-24">
        <Title value={`${eventData.name} Registration`} />
        <h3 className="mb-4 text-2xl">Participant Details</h3>
        <RegistrationForm eventId={eventData.id} eventName={eventData.name} />
      </div>
    </ScreenContainer>
  );
};

export default Register;
