"use client";
import { flags, isLoggedIn, protocolTypes, services } from "@/app/lib/cropData";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { json } from "stream/consumers";

interface Props {}

const MainForm = ({}: Props) => {
  const [inputData, setInputData] = useState<{
    duration: number;
    protocol_type: string;
    service: string;
    flag: string;
    source_byte: number;
    destination_byte: number;
    num_failed_logins: number;
    logged_in: boolean | string;
    num_of_connections: number;
    su_attempted: boolean | string;
    number_of_root_access: number;
    number_of_file_created: number;
  }>({
    duration: 40,
    protocol_type: "tcp",
    service: "private",
    flag: "SF",
    source_byte: 50,
    destination_byte: 43,
    num_failed_logins: 3,
    logged_in: false,
    num_of_connections: 24,
    su_attempted: false,
    number_of_root_access: 400,
    number_of_file_created: 12,
  });
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const handleSelect = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };
  console.log(inputData);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsFetching(true);
      const res = await fetch(
        `https://tamynator.pythonanywhere.com/intrusion_detection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set the "Content-Type" header
          },
          body: JSON.stringify({
            duration: inputData.duration,
            protocol_type: inputData.protocol_type,
            service: inputData.service,
            flag: inputData.flag,
            source_byte: inputData.source_byte,
            destination_byte: inputData.destination_byte,
            num_failed_logins: inputData.num_failed_logins,
            logged_in: inputData.logged_in === 'true' ? true : false,
            num_of_connections: inputData.num_failed_logins,
            su_attempted: inputData.su_attempted === 'true' ? true : false,
            number_of_root_access: inputData.number_of_root_access,
            number_of_file_created: inputData.number_of_file_created,
          }),
        }
      );
      const data = await res.json();
      console.log(data);
      
      setPrediction(data.result);
      if(data.status !== 200) {
        return toast.error('there was an error try with different values')
      }
      toast.success("Prediction Done😀");
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error("An error ocurred");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="w-full fixed inset-0 flex items-center justify-center px-[2rem] flex-col bg-gray-100"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-[2.3rem] capitalize">
        Intrusion Detection System
      </h2>
      {prediction && <h3 className="text-2xl sm:text-3xl mb-4">Result: {prediction}</h3>}
      <div className="bg-purple-800 rounded-md p-[2rem] font-bold text-2xl min-w-[20rem] w-full max-w-[35rem] flex flex-col space-y-[1rem] items-start overflow-y-scroll max-h-[35rem]">
        <div className="flex flex-col space-y-[.75rem] w-full">
          <label htmlFor="" className="font-semibold text-[.75rem]">
            Duration in seconds
          </label>
          <input
            type="number"
            value={inputData.duration}
            min={1}
            name="duration"
            onChange={handleSelect}
            className="input input-bordered bg-purple-100 w-full"
          />
        </div>
        <div className="flex flex-col space-y-[.75rem] w-full">
          <label htmlFor="" className="font-semibold text-[.75rem]">
            Protocol type
          </label>
          <select
            className="select select-accent w-full  bg-purple-100 "
            onChange={handleSelect}
            value={inputData.protocol_type}
            name="protocol_type"
          >
            {protocolTypes.map((protocol, index) => (
              <option key={index} value={protocol}>
                {protocol}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col space-y-[.75rem] w-full">
          <label htmlFor="" className="font-semibold text-[.75rem]">
            Service
          </label>
          <select
            className="select select-accent w-full  bg-purple-100"
            onChange={handleSelect}
            value={inputData.service}
            name="service"
          >
            {services.map((service, index) => (
              <option key={index} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col space-y-[.75rem] w-full">
          <label htmlFor="" className="font-semibold text-[.75rem]">
            Status of connection
          </label>
          <select
            className="select select-accent w-full  bg-purple-100 "
            onChange={handleSelect}
            value={inputData.flag}
            name="flag"
          >
            {flags.map((flag, index) => (
              <option key={index} value={flag}>
                {flag}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col space-y-[.75rem] w-full">
          <label htmlFor="" className="font-semibold text-[.75rem]">
            Source byte
          </label>
          <input
            type="number"
            placeholder="500"
            min={1}
            value={inputData.source_byte}
            name="source_byte"
            onChange={handleSelect}
            className="input input-bordered bg-purple-100 w-full"
          />
        </div>
        <div className="flex flex-col space-y-[.75rem] w-full">
          <label htmlFor="" className="font-semibold text-[.75rem]">
            Destination byte
          </label>
          <input
            type="number"
            placeholder="5122"
            min={1}
            name="destination_byte"
            value={inputData.destination_byte}
            onChange={handleSelect}
            className="input input-bordered bg-purple-100 w-full"
          />
        </div>

        <div className="flex flex-col space-y-[.75rem] w-full">
          <label htmlFor="" className="font-semibold text-[.75rem]">
            Num failed Logins
          </label>
          <input
            type="number"
            placeholder="5"
            name="num_failed_logins"
            value={inputData.num_failed_logins}
            onChange={handleSelect}
            className="input input-bordered bg-purple-100 w-full"
          />
        </div>

        <div className="flex flex-col space-y-[.75rem] w-full">
          <label htmlFor="" className="font-semibold text-[.75rem]">
            logged in
          </label>
          <select
            className="select select-accent w-full bg-purple-100 "
            onChange={handleSelect}
            value={inputData.logged_in as string}
            name="logged_in"
          >
            {isLoggedIn.map((val, index) => (
              <option key={index} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col space-y-[.75rem] w-full">
          <label htmlFor="" className="font-semibold text-[.75rem]">
            number of connections to the same service
          </label>
          <input
            type="number"
            placeholder="500"
            name="num_of_connections"
            onChange={handleSelect}
            value={inputData.num_of_connections}
            className="input input-bordered bg-purple-100 w-full"
          />
        </div>
        <div className="flex flex-col space-y-[.75rem] w-full">
          <label htmlFor="" className="font-semibold text-[.75rem]">
            su_attempted
          </label>
          <select
            className="select select-accent  bg-purple-100 w-full"
            onChange={handleSelect}
            value={inputData.su_attempted as string}
            name="su_attempted"
          >
            {isLoggedIn.map((val, index) => (
              <option key={index} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col space-y-[.75rem] w-full">
          <label htmlFor="" className="font-semibold text-[.75rem] capitalize">
            number of root access
          </label>
          <input
            type="number"
            placeholder="5"
            name="number_of_root_access"
            onChange={handleSelect}
            value={inputData.number_of_root_access}
            className="input input-bordered bg-purple-100 w-full"
          />
        </div>
        <div className="flex flex-col space-y-[.75rem] w-full">
          <label htmlFor="" className="font-semibold text-[.75rem]">
            Number of files created
          </label>
          <input
            type="number"
            placeholder="5"
            name="number_of_file_created"
            onChange={handleSelect}
            value={inputData.number_of_file_created}
            className="input input-bordered bg-purple-100 w-full"
          />
        </div>

        <button className="btn btn-active btn-primary px-[5rem] flex items-center justify-center disabled:opacity-50 disabled:bg-primary" disabled={isFetching ? true : false} >
          {isFetching ? (
            <Image src="/rollin-sp.svg" alt="spinner" width={30} height={30} />
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
};

export default MainForm;
