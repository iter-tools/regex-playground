import { useState } from "react";
import { Header, TextInput, CheckBox, Button } from "grommet";
import { useForm, SubmitHandler } from "react-hook-form";

function RegExpForm() {
  const [pattern, setPattern] = useState("");
  const [text, setText] = useState("");
  const [flags, setFlags] = useState({
    g: false,
    i: false,
    s: false,
    m: false,
    y: false,
  });

  function handlePatternInput(event) {
    setPattern(event.target.value);
  }

  return (
    <form id="regexp">
      <label htmlFor="pattern"></label>
      <input value={pattern} onInput={handlePatternInput} />

      <TextInput
        name="text"
        icon={<BlockQuote />}
        value={text}
        onInput={this.onTextInput}
        placeholder="text"
      />
      <CheckBox name="g" label="g" />
      <CheckBox name="i" label="i" />
      <CheckBox name="s" label="s" />
      <CheckBox name="m" label="m" />
      <CheckBox name="y" label="y" />

      <Button primary type="submit" label="execute" />
    </form>
  );
}

export default RegExpForm;
