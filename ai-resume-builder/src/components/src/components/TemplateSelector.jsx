function TemplateSelector({
  template,
  setTemplate,
}) {

  return (
    <div className="template-selector">

      <span>Template</span>

      <button
        className={
          template === "classic"
            ? "active"
            : ""
        }
        onClick={() =>
          setTemplate("classic")
        }
      >
        Classic
      </button>

      <button
        className={
          template === "modern"
            ? "active"
            : ""
        }
        onClick={() =>
          setTemplate("modern")
        }
      >
        Modern
      </button>

      <button
        className={
          template === "minimal"
            ? "active"
            : ""
        }
        onClick={() =>
          setTemplate("minimal")
        }
      >
        Minimal
      </button>

    </div>
  );
}

export default TemplateSelector;