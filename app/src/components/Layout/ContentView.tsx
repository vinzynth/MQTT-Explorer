import * as React from 'react'
import ChartPanel from '../ChartPanel'
import ReactSplitPane from 'react-split-pane'
import Tree from '../Tree/Tree'
import { AppState } from '../../reducers'
import { ChartParameters } from '../../reducers/Charts'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { Sidebar } from '../Sidebar'
import ReactResizeDetector from 'react-resize-detector'

interface Props {
  heightProperty: any
  paneDefaults: any
  connectionId?: string
  chartPanelItems: List<ChartParameters>
}

function ContentView(props: Props) {
  const [height, setHeight] = React.useState<string | number>('100%')
  const [detectedHeight, setDetectedHeight] = React.useState(0)
  const [chatPanelItemCount, setChartPanelItemCount] = React.useState(props.chartPanelItems.count())
  const detectSize = React.useCallback((width, height) => {
    console.log(width, height)
    setDetectedHeight(height)
  }, [])

  // Open chart panel on start and when a new chart is added but the panel is closed
  React.useEffect(() => {
    const almostAtFullHeight = !isNaN(height as any) && Math.abs(detectedHeight - (height as number)) < 20
    if ((!height || height === '100%' || almostAtFullHeight) && props.chartPanelItems.count() > 0) {
      setHeight('calc(100% - 250px)')
    }

    if (props.chartPanelItems.count() === 0) {
      setHeight('100%')
    }

    setChartPanelItemCount(props.chartPanelItems.count())
  }, [props.chartPanelItems])

  return (
    <div className={props.paneDefaults}>
      <ReactSplitPane
        step={10}
        split="horizontal"
        minSize={0}
        size={height}
        defaultSize={'100%'}
        allowResize={true}
        style={{ height: 'calc(100vh - 64px)' }}
        pane1Style={{ maxHeight: '100%' }}
        pane2Style={{ maxWidth: '100%', overflow: 'hidden auto' }}
        onChange={setHeight}
      >
        <span>
          <ReactResizeDetector handleHeight={true} onResize={detectSize} />

          <ReactSplitPane
            step={20}
            primary="second"
            className={props.heightProperty}
            split="vertical"
            minSize={250}
            defaultSize={500}
            allowResize={true}
            style={{ height: '100%' }}
            pane1Style={{ overflowX: 'hidden' }}
            resizerStyle={{ height: '100%' }}
          >
            <Tree />
            <div className={props.paneDefaults} style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
              <Sidebar connectionId={props.connectionId} />
            </div>
          </ReactSplitPane>
        </span>
        <ChartPanel />
      </ReactSplitPane>
    </div>
  )
}

const mapStateToProps = (state: AppState) => {
  return {
    chartPanelItems: state.charts.get('charts'),
  }
}

export default connect(mapStateToProps)(ContentView)
