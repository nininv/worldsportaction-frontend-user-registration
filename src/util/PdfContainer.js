import React from 'react';
import { Button } from 'antd';

class PdfContainer extends React.Component {

  render() {
    const bodyRef = React.createRef();
    const createPdf = () => this.props.createPdf(bodyRef.current);
    return (
      <section >
        <section className="pdf-body" ref={bodyRef}>
          {this.props.children}
        </section>
        <section className="pdf-toolbar">
          {/* <button onClick={createPdf}>Create PDF</button> */}
          {this.props.showPdfButton &&
            <div className="container pdf-container-main-div">
              <Button className="primary-add-comp-form" type="primary"
                onClick={createPdf} >
                {"Download"}
              </Button>
            </div>}
        </section>
      </section>
    )
  }
}


export default PdfContainer;

// export default (props) => {
//   const bodyRef = React.createRef();
//   const createPdf = () => props.createPdf(bodyRef.current);
//   const { createPdf1 } = this.props
//   return (
//     <section >
//       <section className="pdf-toolbar">
//         {/* <button onClick={createPdf}>Create PDF</button> */}
//       </section>
//       <section className="pdf-body" ref={bodyRef}>
//         {props.children}
//       </section>
//     </section>
//   )
// }