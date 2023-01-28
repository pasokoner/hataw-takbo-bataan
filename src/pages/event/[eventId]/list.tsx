import { type NextPage } from "next";
import { useRouter } from "next/router";

import React, { useState } from "react";
import { api } from "../../../utils/api";
import ScreenContainer from "../../../layouts/ScreenContainer";
import { RiLoader5Fill } from "react-icons/ri";
import EditName from "../../../components/EditName";
import { useLocalStorage } from "usehooks-ts";
import Title from "../../../components/Title";

const List: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const [regNumber, setRegNumber] = useState<number | null>(null);
  const [maxItems, setMaxItems] = useState<number>(50);
  const [cameraPassword, setCameraPassword] = useLocalStorage(
    "camera-password",
    ""
  );

  const {
    data: participantData,
    isLoading,
    refetch,
  } = api.participant.getAll.useQuery({
    eventId: eventId as string,
    registrationNumber: regNumber ? regNumber : undefined,
    take: maxItems,
  });

  const { data: eventData, isLoading: eventLoading } =
    api.event.details.useQuery(
      {
        eventId: eventId as string,
        includeKM: false,
      },
      {
        refetchOnWindowFocus: false,
        refetchInterval: 15000,
      }
    );

  console.log(participantData);

  if (eventLoading) {
    return <></>;
  }

  if (!eventData) {
    return (
      <ScreenContainer className="mx-auto px-8 py-6 md:px-16">
        <div className="mx-auto pt-20">
          <p className="text-3xl">Event not found!</p>
        </div>
      </ScreenContainer>
    );
  }

  if (cameraPassword !== eventData.cameraPassword) {
    return (
      <ScreenContainer className="mx-auto px-8 py-6 md:px-16">
        <Title value={`HATAW BATAAN TAKBO - ${eventData.name}`} />
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <label htmlFor="cameraPassword">LIST PASSWORD</label>
          <input
            type="text"
            id="cameraPassword"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setCameraPassword(e.target.value);
            }}
          />
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="mx-auto px-8 py-6 md:px-16">
      <div>
        <div className="mb-2">
          <label htmlFor="maxItems" className="mr-4">
            No. of items
          </label>
          <select
            id="maxItems"
            value={maxItems}
            onChange={(e: React.FormEvent<HTMLSelectElement>) => {
              setMaxItems(parseInt(e.currentTarget.value));
            }}
          >
            {[10, 50, 100, 10000].map((maxItem) => (
              <option key={maxItem} value={maxItem}>
                {maxItem}
              </option>
            ))}
          </select>
        </div>
        <input
          type="number"
          placeholder="Search Registration #"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setRegNumber(parseInt(e.currentTarget.value));
          }}
          className="mb-2 w-full"
        />
        <div className="grid grid-cols-6 bg-primary text-lg font-semibold text-white md:text-2xl">
          <p className="col-span-1 border-r-2 border-white p-2 md:col-span-1">
            REG NO.
          </p>
          <p className="col-span-5 p-2 md:col-span-5">NAME</p>
        </div>
        {isLoading && (
          <RiLoader5Fill className="mx-auto mt-6 animate-spin text-center text-5xl" />
        )}
        {participantData &&
          participantData
            // .filter(({ registrationNumber }) => registrationNumber !== regNumber)
            .map(({ firstName, lastName, registrationNumber, id }) => (
              <div
                key={id}
                className="grid grid-cols-6 border-2 border-r-2 border-solid text-xs md:text-lg"
              >
                <div className="col-span-1 flex items-center justify-between border-r-2 p-2 md:col-span-1">
                  <p>{registrationNumber}</p>
                  <div></div>
                </div>
                <div className="col-span-5 flex items-center justify-between p-2 md:col-span-5">
                  <p>
                    {firstName} {lastName}
                  </p>
                  <EditName
                    participantId={id}
                    registrationNumber={registrationNumber}
                    firstName={firstName}
                    lastName={lastName}
                    refetchFn={() => {
                      /*eslint-disable @typescript-eslint/no-floating-promises*/
                      refetch();
                    }}
                  />
                </div>
              </div>
            ))}
      </div>
    </ScreenContainer>
  );
};

export default List;
