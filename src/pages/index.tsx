import { type NextPage } from "next";
import ScreenContainer from "../layouts/ScreenContainer";
import Image from "next/image";

import HTBLogo from "../assets/hataw-takbo-bataan.png";
import OneBataanLogo from "../assets/1bataan.png";
import SeekPhorLogo from "../assets/seekphor.png";
import HermosaLogo from "../assets/hermosa.png";
import BataanSealLogo from "../assets/bataan-seal.png";
import Link from "next/link";

import { GoNote } from "react-icons/go";
import { FiUserCheck, FiDownload } from "react-icons/fi";

const Home: NextPage = () => {
  return (
    <>
      <div className="w-full py-5">
        <ScreenContainer className="mx-auto grid grid-cols-6 gap-14 sm:gap-0">
          <div className="order-last col-span-6 mb-20  flex flex-col items-center justify-center sm:-order-1 sm:col-span-3 sm:mb-0">
            <div>
              <h1 className="mb-2 text-3xl font-semibold sm:text-5xl">
                HERMOSA
              </h1>
              <div className="mb-4 text-lg font-medium">
                <p>Event Date: January 29, 2023</p>
                <p>Brgy. Mabuco, Hermosa Bataan</p>
              </div>
              <p className="mb-4 text-sm">
                *Free event t-shirt for first 2,000 registered participant
              </p>
              <div className="grid grid-cols-2 gap-6">
                <Link
                  href="/event/cld87jvpj0000f114kp3wsili/register"
                  className="col-span-1 flex items-center justify-center gap-2 rounded-md bg-primary py-3 font-semibold text-white shadow-md shadow-primary-hover hover:bg-primary-hover"
                >
                  REGISTER <FiUserCheck />
                </Link>
                <Link
                  href="/event/cld87jvpj0000f114kp3wsili/register"
                  className="col-span-1 flex items-center justify-center gap-2 rounded-md border-2 border-solid border-black py-3 font-semibold shadow-md hover:bg-slate-50"
                >
                  WAIVER <GoNote />
                </Link>
              </div>
            </div>
          </div>
          <Image
            src={HTBLogo}
            alt="Hataw Takbo Bataan Logo"
            className="col-span-6 mx-auto max-w-[15rem] animate-run sm:col-span-3 sm:max-w-full"
          />
        </ScreenContainer>
      </div>
      <div className="relative mb-auto bg-slate-400 bg-contain py-4">
        <ScreenContainer className="md:0 mx-auto grid grid-cols-4 items-center gap-7">
          <Image
            src={BataanSealLogo}
            width={65}
            alt="Bataan Seal"
            className="col-span-2 mx-auto md:col-span-1"
          />
          <Image
            src={OneBataanLogo}
            width={65}
            alt="One Bataan Logo"
            className="col-span-2 mx-auto md:col-span-1"
          />
          <Image
            src={SeekPhorLogo}
            width={65}
            alt="Seek Phor"
            className="col-span-2 mx-auto md:col-span-1"
          />
          <Image
            src={HermosaLogo}
            width={65}
            alt="Hermosa Logo"
            className="col-span-2 mx-auto md:col-span-1"
          />
        </ScreenContainer>
      </div>

      <div className="w-full">
        <ScreenContainer className="mx-auto  py-24">
          <h2 className="mb-10 text-center text-4xl font-semibold text-slate-500">
            FREQUENTLY ASKED QUESTION
          </h2>
          <div className="grid grid-cols-2 gap-12">
            <div className="col-span-2 md:col-span-1">
              <h3 className="mb-1 text-2xl font-medium">AGE REQUIREMENTS:</h3>
              <ul className="ml-8 flex list-disc flex-col gap-2">
                <li>
                  For 5k participants, must be 13 years old and above. Kids
                  above 12 years old and above will be allowed to run provided
                  he/she is accompanied by a registered parent or gurdian.
                </li>
                <li>For 10k participants, must be 16 years old and above.</li>
                <li>
                  Participants below the age of 18, must seek their
                  parent/guardian consent and fill up the entry form where the
                  parent or guardian is required to sign.
                </li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h3 className="mb-1 text-2xl font-medium">
                RULES AND REGULATION:
              </h3>
              <ul className="ml-8 flex list-decimal flex-col gap-2">
                <li>
                  Participants below the age of 18, must seek their
                  parent/guardian consent and fill up the entry form where the
                  parent or guardian is required to sign.
                </li>
                <li>
                  Race bib numbers must be worn at all times during the race.
                  BIB nubmers must be pinned in front of your running shirt.{" "}
                  <span className="font-semibold">NO BIB, NO RACE</span>
                </li>
              </ul>
            </div>
          </div>
        </ScreenContainer>
      </div>

      <div className="w-full bg-slate-200">
        <ScreenContainer className="md:0 mx-auto grid grid-cols-6 items-center py-24">
          <div className="order-last col-span-6 flex flex-col gap-4 lg:-order-1 lg:col-span-4">
            <h2 className="text-3xl font-semibold">
              LIABILITY AND RACE AGREEMENT
            </h2>
            <p>
              <span className="ml-10"></span>I attest that I am physically and
              mentally fit to participate in the Hataw Takbo, Bataan Hermosa and
              have full knowledge of and assume all the risks associated with my
              decision to voluntarily participate in the said event.
            </p>
            <p>
              <span className="ml-10"></span>I also understand and accept that
              during the event, the medical assistance available to me is
              limited to first aid treatment. I am aware and agree that medical
              expenses for injuries or medical treatment incurred at the event
              are my sole responsibility as a participant.
            </p>
            <p>
              <span className="ml-10"></span>I give my permission for the free
              use of my names, photos and voice in any broadcast, telecast,
              digital, print material or any other material in any medium for
              this event.
            </p>
            <p>
              <span className="ml-10"></span>In consideration of being permitted
              to participate, I do hereby waive and release forever, any and all
              rights to claims and damages I may have against the race
              organizers, sponsors, volunteers, race officials, and all parties
              involved with this event, arising from any and all liability for
              injury, death or damages or any other claims, demands, losses or
              damages incurred by me in connection with my participation in this
              event.
            </p>
            <p>
              <span className="ml-10"></span>I agree to abide by any decision of
              the race official relative to any aspect of my participation in
              this event. I attest that I have read the rules of the race,
              understood it and agree to abide by them.
            </p>
            <p>
              Participants Signature: _____________________ (parents must sign
              if participant is below 18 years old)
            </p>
            <p>In case of emergency, contact: ______________</p>
            <p className="mb-5">Contact No.: _____________</p>

            <button className="col-span-1 flex items-center justify-center gap-2 rounded-md border-2 border-solid border-black py-4 font-semibold shadow-md hover:bg-slate-100 sm:max-w-[20rem]">
              DOWNLOAD WAIVER <FiDownload />
            </button>
          </div>
          <div className="col-span-6 mx-auto mb-8 lg:col-span-2 lg:mb-0">
            ICON GOES HERE
          </div>
        </ScreenContainer>
      </div>
    </>
  );
};

export default Home;
