import { Button } from "@/components/ui/button";
import useLogin from "@/hooks/useLogin";
import { useEffect, useState } from "react";
import { changeOption } from "./functions";
import { ArrowRight2, HambergerMenu } from "iconsax-react";
import { Separator } from "@/components/ui/separator";
import "./index.css";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "/src/assets/logo.png";

export type TabOptions = "transaction" | "statistics" | "users";

type SidebarButtonProps = {
  text: TabOptions;
  isSelected: boolean;
  setOption: (option: TabOptions) => void;
  onClick?: () => void;
};

const SidebarButton = ({
  text,
  isSelected,
  setOption,
  onClick,
}: SidebarButtonProps) => {
  return (
    <Button
      variant="secondary"
      className="sidebar-button"
      onClick={() => {
        changeOption(text, setOption);
        if (onClick) onClick();
      }}
    >
      {isSelected && <ArrowRight2 size="32" color="#FF8A65" variant="Bold" />}
      <span className="text-2xl">{text.toUpperCase()}</span>
    </Button>
  );
};

export default function AdminConsole() {
  const navigate = useNavigate();
  const { logout, loginObject } = useLogin();
  const [currentOption, setOption] = useState<TabOptions>("statistics");
  const [showSidebar, setSidebar] = useState(true);
  const sidebarButtons: TabOptions[] = [
    "transaction",
    "statistics",
    "users",
  ];

  useEffect(() => {
    if (!loginObject) navigate("/");
  }, [loginObject, navigate]);

  return (
    loginObject && (
      <div className="admin-console-screen">
        <div className="admin-header bg-muted">
          <span className="admin-sidebar-toggle">
            <Button
              onClick={() => setSidebar(!showSidebar)}
              variant="secondary"
              className="sidebar-toggle-button"
            >
              <HambergerMenu size="32" color="#FF8A65" />
            </Button>
          </span>
          <span className="admin-console-title font-bold text-2xl">
            <img className="admin-console-title-logo" src={logo} alt="logo" />
            ADMIN DASHBOARD
          </span>
        </div>

        <div className="admin-body">
          <div
            className={`admin-sidebar bg-muted ${
              showSidebar ? "visible" : "invisible"
            }`}
          >
            {sidebarButtons.map((value) => (
              <>
                <SidebarButton
                  key={value + "Button"}
                  text={value}
                  isSelected={currentOption === value}
                  setOption={setOption}
                  onClick={() => navigate(value)}
                />
                <Separator />
              </>
            ))}
            <span className="admin-sidebar-logout-block">
              <Button
                variant="secondary"
                className="sidebar-button"
                onClick={logout}
              >
                <span className="text-2xl">LOGOUT</span>
              </Button>
            </span>
          </div>

          <div className="admin-content">
            <Outlet />
          </div>
        </div>
      </div>
    )
  );
}
