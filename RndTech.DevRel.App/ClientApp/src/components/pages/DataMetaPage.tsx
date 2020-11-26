import FilterIcon from '@skbkontur/react-icons/Filter'
import * as React from 'react'
import { getMeta, MetaData } from '../../api'
import { Filter } from '../filters/Filter'
import Plural from '../Plural'
import injectSheet from 'react-jss';
import { Col, Container, Content, Grid, Loader, Row } from 'rsuite';

const styles = {
    container: {
        marginTop: -30
    },
    groups: {
        width: '100%'
    },
    groupRow: {
        display: 'grid',
        gridTemplateColumns: '4fr 40px 4fr 40px 4fr 40px 4fr'
    },
    table: {
        width: '100%'
    },
    ratio: {
        textAlign: 'right'
    },
    important: {
        color: '#228007'
    },
    unimportant: {
        color: '#808080'
    },
    icon: {
        opacity: 0.5
    }
}

type Props = {
    classes?: any,
    filter: Filter
}

type State = {
    isReady: boolean,
    data: MetaData
}

class SelectionFactorsPage extends React.Component<Props, State> {
    state: State = {
        isReady: false,
        data: {
            count: 0,
            total: 0,
            sources : []
        }
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        this.loadData(this.props.filter)
            .then(() => {
                if (this._isMounted) {
                    this.setState({isReady: true})
                }
            })
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.filter !== prevProps.filter) {
            this.setState({ isReady: false })

            this.loadData(this.props.filter)
                .then(() => {
                    if (this._isMounted) {
                        this.setState({isReady: true})
                    }
                })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    loadData(filter: Filter) {
        return getMeta(filter)
            .then(data => {
                if (this._isMounted) {
                    this.setState({data})
                }
            })
    }

    render() {
        const { classes } = this.props
        const { isReady, data } = this.state

        if (!isReady) {
            return (<Loader content='Загрузка данных' center />)
        }

        return (
            <Container>
                <Content>
                    <div className={classes.groups}>
                        <h4>
                            {data.count}
                            &nbsp;<Plural n={data.count} one='участник' few='участника' many='участников' />
                            &nbsp;в выборке (из {data.total})
                        </h4>
                        <Grid fluid>
                            <Row gutter={36}>
                                <Col xs={24} sm={24} md={8}>
                                    {this.renderGroup('Города', 'cities')}
                                </Col>
                                <Col xs={24} sm={24} md={8}>
                                    {this.renderGroup('Возраст', 'ages')}
                                </Col>
                                <Col xs={24} sm={24} md={8}>
                                    {this.renderGroup('Образование', 'education')}
                                </Col>
                            </Row>

                            <Row gutter={36}>
                                <Col xs={24} sm={24} md={8}>
                                    {this.renderGroup('Уровни', 'levels')}
                                </Col>
                                <Col xs={24} sm={24} md={8}>
                                    {this.renderGroup('Профессии', 'professions')}
                                </Col>
                                <Col xs={24} sm={24} md={8}>
                                    {this.renderGroup('Языки', 'languages')}
                                </Col>
                            </Row>

                            <Row gutter={36}>
                                <Col xs={24} sm={24} md={8}>
                                    {this.renderGroup('Источники информации о компаниях', 'companySources')}
                                </Col>
                                <Col xs={24} sm={24} md={8}>
                                    {this.renderGroup('Ходят ли на митапы', 'isCommunity')}
                                </Col>
                                <Col xs={24} sm={24} md={8}>
                                    {this.renderGroup('Откуда узнают о митапах', 'communitySource')}
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </Content>
            </Container>
        )
    }

    renderGroup(title: string, key: string) {
        const { classes, filter } = this.props
        const { data } = this.state

        return (
            <div key={title}>
                <h3>{title} {filter[key] !== undefined && filter[key] !== null && filter[key].length !== 0
                    ? <span className={classes.icon}><FilterIcon /></span>
                    : ''
                }</h3>
                <table className={classes.table}>
                    <tbody>
                        {Object.keys(data.sources[key]).map(i => {
                        const rowClass =
                            data.sources[key][i] > 0.10 ? classes.important :
                                data.sources[key][i] < 0.05 ? classes.unimportant : null

                        return (
                            <tr key={i} className={rowClass}>
                                <td>{i}</td>
                                <td className={classes.ratio}>
                                    {data.sources[key][i]}
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default injectSheet(styles)(SelectionFactorsPage)
