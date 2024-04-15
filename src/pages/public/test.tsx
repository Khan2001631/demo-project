interface Props {
  children: any
}
const TestComponent = (props: Props) => {
  const { children } = props;
  return (
    <div>
      <div onClick={() => alert("click clieked")}>;
        asdasd
      </div>
      {children}
    </div>
  )
}
export default TestComponent;