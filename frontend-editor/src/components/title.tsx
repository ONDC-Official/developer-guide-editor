import { useContext } from "react";
import { GlobalEditMode } from "../utils/config";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
export function OndcTitle({ children }: any) {
  const appEditMode = useContext(AppContext).editMode;
  const editMode = GlobalEditMode && appEditMode;
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-between mx-auto px-4 py-2 shadow-lg fixed top-0 left-0 right-0 z-20 bg-slate-200">
        <img
          onClick={() => navigate("/home")}
          src="https://seeklogo.com/images/O/open-network-for-digital-commerce-logo-E7F55933B3-seeklogo.com.png"
          alt="Logo"
          className="h-16 w-auto"
        />
        <button className="flex-grow">
          <GradientText>
            DEVELOPER GUIDE{" "}
            {editMode && <span className=" text-black">~EDIT_MODE</span>}
          </GradientText>
        </button>

        {children}
      </div>
    </>
  );
}
export function GradientText({ children }: any) {
  return (
    <h2
      className="text-3xl md:text-3xl lg:text-3xl font-bold text-center text-transparent bg-clip-text flex-grow"
      style={{
        backgroundImage: "linear-gradient(to right, #007CF0, #00DFD8)",
      }}
    >
      {children}
    </h2>
  );
}
