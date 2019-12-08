import React from 'react'
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

const WholeScreenLoader = () => (
  <div className="page_container whole_page_loader">
    <Segment>
      <Dimmer active>
        <Loader indeterminate>Se încarcă cea mai șmecherie </Loader>
      </Dimmer>
      <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
    </Segment>
  </div>
)

export default WholeScreenLoader