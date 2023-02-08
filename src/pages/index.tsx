import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

import { useRef } from "react";

import ScreenContainer from "../layouts/ScreenContainer";

import { GoNote } from "react-icons/go";
import { FiUserCheck, FiDownload } from "react-icons/fi";
import { AiOutlineNotification } from "react-icons/ai";
import { RiGuideLine } from "react-icons/ri";

import HTBLogo from "../assets/hataw-takbo-bataan.png";
import OneBataanLogo from "../assets/1bataan.png";
import SeekPhorLogo from "../assets/seekphor.png";
import HermosaLogo from "../assets/hermosa.png";
import BataanSealLogo from "../assets/bataan-seal.png";

import Alternative1 from "../assets/landing-page/alternative-1.jpg";
import Alternative2 from "../assets/landing-page/alternative-2.jpg";
import Alternative3 from "../assets/landing-page/alternative-3.jpg";

import RouteImg from "../assets/landing-page/hermosa-route.jpg";
import StretchImg from "../assets/landing-page/stretch.jpg";
import NoticeImg from "../assets/landing-page/notice.jpg";
import WaiverImg from "../assets/landing-page/waiver.png";

const Home: NextPage = () => {
  const waiverRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="w-full py-5">
        <input />
        <ScreenContainer className="py:10 grid grid-cols-6 gap-14 sm:gap-0 sm:py-16">
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
                <button
                  onClick={() => {
                    if (waiverRef.current) {
                      window.scrollTo({
                        top: waiverRef.current.offsetTop,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="col-span-1 flex items-center justify-center gap-2 rounded-md border-2 border-solid border-black py-3 font-semibold shadow-md hover:bg-slate-50"
                >
                  WAIVER <GoNote />
                </button>
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
      <div className="relative mb-auto bg-slate-200 bg-contain py-4">
        <ScreenContainer className="md:0 grid grid-cols-4 items-center gap-7">
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
        <ScreenContainer className="pt-20 text-gray-500">
          <h2 className="mb-4 flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-yellow-400 p-2 text-3xl font-semibold md:gap-4">
            RACE GUIDE <RiGuideLine className="text-yellow-400" />
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Image
              width={800}
              src={RouteImg}
              alt="Hermosa Route Image"
              className="col-span-2 md:col-span-1"
            />
            <Image
              width={800}
              src={StretchImg}
              alt="Hermosa Route Image"
              className="col-span-2 md:col-span-1"
            />
          </div>
        </ScreenContainer>
      </div>

      <div className="w-full">
        <ScreenContainer className="py-20 text-gray-500 ">
          <h2 className="mb-4 flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-yellow-400 p-2 text-3xl font-semibold md:gap-4">
            PUBLIC NOTICE <AiOutlineNotification className="text-yellow-400" />
          </h2>
          <div className="grid grid-cols-2 gap-10">
            <Image
              src={NoticeImg}
              alt="Notice Image"
              width={1600}
              className="col-span-2 mx-auto w-full rounded-sm md:w-8/12"
            />
            <Image
              src={Alternative1}
              alt="alternative route 1"
              width={1600}
              className="col-span-2 rounded-sm md:col-span-1"
            />
            <Image
              src={Alternative2}
              alt="alternative route 2"
              width={1600}
              className="col-span-2 rounded-sm md:col-span-1"
            />
            <Image
              src={Alternative3}
              alt="alternative route 3"
              width={1600}
              className="col-span-2 rounded-sm md:col-span-1"
            />
          </div>
        </ScreenContainer>
      </div>

      <div className="w-full">
        <ScreenContainer className="py-20 text-gray-500 md:py-28">
          <h2 className="mb-10 text-center text-3xl font-semibold text-slate-500 md:text-4xl">
            FREQUENTLY ASKED QUESTION
          </h2>
          <div className="grid grid-cols-2 gap-12">
            <div className="col-span-2 md:col-span-1">
              <h3 className="mb-1 text-xl font-medium md:text-2xl">
                AGE REQUIREMENTS:
              </h3>
              <ul className="ml-8 flex list-disc flex-col gap-2 text-sm">
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
              <h3 className="mb-1 text-xl font-medium md:text-2xl">
                RULES AND REGULATION:
              </h3>
              <ul className="ml-8 flex list-decimal flex-col gap-2 text-sm">
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

      <div ref={waiverRef} className="w-full bg-slate-200">
        <ScreenContainer className="md:0 grid grid-cols-6 items-center py-14 text-gray-500 md:py-24">
          <div className="order-last col-span-6 flex flex-col gap-4 text-sm lg:-order-1 lg:col-span-4">
            <h2 className="text-2xl font-semibold lg:text-3xl">
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

            <a
              href="/race-agreement.pdf"
              download="race-waiver.pdf"
              className="col-span-1 flex items-center justify-center gap-2 rounded-md border-2 border-solid border-black py-4 font-semibold shadow-md hover:bg-slate-100 sm:max-w-[20rem]"
            >
              DOWNLOAD WAIVER <FiDownload />
            </a>
          </div>
          <div className="col-span-6 mx-auto mb-14 w-6/12 lg:col-span-2 lg:mb-0 lg:w-full">
            <Image src={WaiverImg} alt="Waiver Image" />
          </div>
        </ScreenContainer>
      </div>
    </>
  );
};

export default Home;
