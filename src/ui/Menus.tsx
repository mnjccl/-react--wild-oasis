import styled from "styled-components";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";

import { useOutsideClick } from "../hooks/useOutsideClick";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul<{ $position: { x: number; y: number } | null }>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => (props.$position ? props.$position.x : 0)}px;
  top: ${(props) => (props.$position ? props.$position.y : 0)}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

interface MenusContextType {
  openId: number | null;
  close: () => void;
  open: (id: number) => void;
  position: { x: number; y: number } | null;
  setPosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number } | null>
  >;
}
const MenusContext = createContext<MenusContextType | null>(null);

interface MenusProps {
  children: ReactNode;
}

function Menus({ children }: MenusProps) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  const close = () => setOpenId(null);
  const open = (id: number) => setOpenId(id);

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

interface ToggleProps {
  id: number;
}

function Toggle({ id }: ToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(MenusContext);
  if (!context) {
    throw new Error("Toggle must be used within a MenusProvider");
  }
  const { close, open, setPosition } = context;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isOpen && e.key === "Escape") {
        close();
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });

    setIsOpen((prev) => {
      const newOpenState = !prev;

      setTimeout(() => {
        if (newOpenState) {
          open(id);
        } else {
          close();
        }
      }, 0);

      return newOpenState;
    });
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

interface ListProps {
  id: number;
  children: React.ReactNode;
}

function List({ id, children }: ListProps) {
  const context = useContext(MenusContext);
  if (!context) {
    throw new Error("List must be used within a MenusContext");
  }
  const { openId, position, close } = context;

  const ref = useOutsideClick<HTMLUListElement>(close, false);

  if (openId === null || +openId !== id) return null;

  return createPortal(
    <StyledList $position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body
  );
}

interface ButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

function Button({ children, icon, onClick, disabled }: ButtonProps) {
  const context = useContext(MenusContext);
  if (!context) return;
  const { close } = context;

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick} disabled={disabled}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
