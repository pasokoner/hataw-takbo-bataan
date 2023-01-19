import { type NextPage } from "next";
import RegistrationForm from "../../components/RegistrationForm";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

const Register: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const { data: eventData, isLoading } = api.event.name.useQuery({
    eventId: eventId as string,
  });

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

  return (
    <div className="px-4 pt-6 pb-24 md:pt-12">
      <h2 className="mb-4 text-2xl">Participant Details</h2>
      <RegistrationForm eventId={eventData.id} eventName={eventData.name} />
    </div>
  );
};

export default Register;
