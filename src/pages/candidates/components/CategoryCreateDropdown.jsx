import style from "@/pages/candidates/style/CategoryCreateDropdown.module.scss";
import CheckBox from "masterComponents/CheckBox";
import { useState, useRef, useEffect } from "react";
import FormInput from "masterComponents/FormInput";
import IconAccept from "@/assets/icons/other/IconAccept";
import IconDecline from "@/assets/icons/other/IconDecline";
import IconTrash from "@/assets/icons/other/IconTrash";

export const CategoryCreateDropdown = ({
  label,
  items = [],
  onChange,
  onDelete,
  fixedDropdown = false,
  width,
}) => {
  const [isAddSkillVisible, setIsAddSkillVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const syncItems = (items) => {
    onChange && typeof onChange === "function" && onChange(items);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownContent = () => {
    return (
      <div
        className={style.dropdownContent}
        style={
          fixedDropdown
            ? {
                position: "fixed",
                top: dropdownRef.current
                  ? dropdownRef.current.getBoundingClientRect().bottom + 2
                  : 0,
                left: dropdownRef.current
                  ? dropdownRef.current.getBoundingClientRect().left
                  : 0,
                width: dropdownRef.current
                  ? dropdownRef.current.getBoundingClientRect().width
                  : "auto",
                zIndex: 999,
              }
            : {}
        }
      >
        <ul className={isAddSkillVisible ? style.addSkillListIsVisible : ""}>
          {Array.isArray(items) &&
            items.map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  const updatedItems = items.map((i) => {
                    if (i.id === item.id) {
                      return { ...i, selected: !i.selected };
                    }
                    return i;
                  });
                  syncItems(updatedItems);
                }}
              >
                <div>
                  <CheckBox checked={item.selected} />
                  <span>{item.label}</span>
                </div>

                {item.delatable && (
                  <div
                    className={style.delete}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item);
                      // e.stopPropagation();
                      // const updatedItems = items?.filter(
                      //   (i) => i.id !== item.id
                      // );
                      // syncItems(updatedItems);
                    }}
                  >
                    <IconTrash />
                  </div>
                )}
              </li>
            ))}
        </ul>
        <div className={style.actions}>
          {isAddSkillVisible ? (
            <div>
              <FormInput
                label="Add New Skill"
                value={inputValue}
                onChange={(value) => setInputValue(value)}
              />
              <div className={style.acceptDecline}>
                <div
                  className={style.accept}
                  onClick={() => {
                    if (inputValue.trim()) {
                      const newItem = {
                        id: crypto.randomUUID(),
                        label: inputValue.trim(),
                        selected: true,
                        isNew: true,
                      };
                      syncItems([...items, newItem]);
                      setInputValue("");
                      setIsAddSkillVisible(false);
                    }
                  }}
                >
                  <IconAccept />
                </div>
                <div
                  className={style.decline}
                  onClick={() => {
                    setInputValue("");
                    setIsAddSkillVisible(false);
                  }}
                >
                  <IconDecline />
                </div>
              </div>
            </div>
          ) : (
            <div
              className={style.addNewSkill}
              onClick={() => setIsAddSkillVisible(true)}
            >
              <span>Add New Skill</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={style.categoryDropdownWrapper}
      style={width ? { width: width } : {}}
      ref={dropdownRef}
    >
      <div
        className={`${style.categoryInput} ${
          isDropdownOpen ? style.focused : ""
        }`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span
          className={`${style.label} ${
            (Array.isArray(items) &&
              items.filter((item) => item.selected).length > 0) ||
            isDropdownOpen
              ? style.hasSelected
              : ""
          }`}
        >
          {label ?? "label"}
        </span>
        <div className={style.categoriesList}>
          {Array.isArray(items) &&
            items
              .filter((item) => item.selected)
              .map((item, index, arr) => {
                if (index < 2 || arr.length <= 2) {
                  return (
                    <div key={item.id} className={style.categoryTag}>
                      <span>{item.label}, </span>
                    </div>
                  );
                } else if (index === 2) {
                  return (
                    <div className={style.categoryTag}>
                      <span style={{ color: "#30ACD0" }}>
                        +({arr.length - 2})
                      </span>
                    </div>
                  );
                }
                return null;
              })}
        </div>
      </div>
      {isDropdownOpen && dropdownContent()}
    </div>
  );
};
