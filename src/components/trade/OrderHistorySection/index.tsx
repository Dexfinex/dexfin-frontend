import { BiMehBlank, BiTrendingUp } from "react-icons/bi";
import { Button, Checkbox, Tab, TabList, Tabs, Tooltip } from "@chakra-ui/react";
import ChakraReactDatePicker from "./ChakraReactDatePicker";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Table from 'rc-table';
import { BiSearch } from "react-icons/bi";
import { CustomizedInput } from "../BuySell/components/MarketInput";
import { getAssetIconUrlBySymbolName } from "../../../constants/mock/tradepairs.js";
import { formatDate, formatNumberByFrac } from "../../../utils/trade.util.js";
import { FaArrowUp, FaArrowDown, } from "react-icons/fa";
import { MdInfo } from "react-icons/md";
import { DepositWithdrawModal } from "../BuySell/components/Modals/DepositAndWithdrawModal";
import { unit } from "../../TradingViewModal.js";
import { Web3AuthContext } from "../../../providers/Web3AuthContext.js";
import { CalendarIcon } from 'lucide-react';


const mainColumns = [
    {
        title: "Date",
        render: (text, record) => {

            return {
                children: record.isMainRow ? (
                    <div>
                        {record.dateText}
                    </div>
                ) : (
                    <Table
                        columns={subOrderColumns}
                        data={record.subOrders}
                    />
                ),
                props: {
                    colSpan: record.isMainRow ? 1 : 11
                }
            }
        }
    },
    {
        title: "ID",
        render: (text, record) => {
            return (
                <div>
                    {record.id_sliced}
                </div>
            )
        }
    },
    {
        title: "Pair",
        render: (text, record) => {
            return (
                <div>
                    {record.pair}
                </div>
            )
        }
    },
    {
        title: "Type",
        render: (text, record) => {
            return (
                <div style={{
                    color: record.typeColor
                }}>
                    {record.type}
                </div>
            )
        }
    },
    {
        title: "Amount",
        render: (text, record) => {
            return (
                <div>
                    {record.amount}
                </div>
            )
        }
    },
    {
        title: "Price",
        render: (text, record) => {
            return (
                <div>
                    {record.price}
                </div>
            )
        }
    },
    {
        title: "FilledPrice",
        render: (text, record) => {
            return (
                <div>
                    {record.filledPrice}
                </div>
            )
        }
    },
    {
        title: "Total",
        render: (text, record) => {
            return (
                <div>
                    {record.total}
                </div>
            )
        }
    },
    {
        title: "Settled Amount",
        render: (text, record) => {
            return (
                <div>
                    {record.amount}
                </div>
            )
        }
    },
    {
        title: "Fee",
        render: (text, record) => {
            return (
                <div>
                    {record.feeText}
                </div>
            )
        }
    },
    {
        title: "Status",
        render: (text, record) => {
            return (
                <div style={{
                    color: record.statusColor
                }}>
                    {record.status}
                </div>
            )
        }
    }
];

const subOrderColumns = [
    {
        title: "ID",
        render: (text, record) => {
            return (
                <div>
                    {record.id}
                </div>
            )
        }
    },
    {
        title: "Pair",
        render: (text, record) => {
            return (
                <div>
                    {record.pair}
                </div>
            )
        }
    },
    {
        title: "Side",
        render: (text, record) => {
            return (
                <div style={{
                    color: record.sideColor
                }}>
                    {record.side}
                </div>
            )
        }
    },
    {
        title: "Amount (base)",
        render: (text, record) => {
            return (
                <div>
                    {record.amountBase}
                </div>
            )
        }
    },
    {
        title: "Order Price",
        render: (text, record) => {
            return (
                <div>
                    {record.orderPrice}
                </div>
            )
        }
    },
    {
        title: "Filled Price",
        render: (text, record) => {
            return (
                <div>
                    {record.filledPrice}
                </div>
            )
        }
    },
    {
        title: "Amount (quote)",
        render: (text, record) => {
            return (
                <div>
                    {record.amountQuote}
                </div>
            )
        }
    },
    {
        title: "Exchanges",
        render: (text, record) => {
            return (
                <div>
                    {record.exchanges}
                </div>
            )
        }
    },
    {
        title: "Settled Amount",
        render: (text, record) => {
            return (
                <div>
                    {record.settledAmount}
                </div>
            )
        }
    },
    {
        title: "Status",
        render: (text, record) => {
            return (
                <div style={{
                    color: record.statusColor
                }}>
                    {record.status}
                </div>
            )
        }
    }
];


const HeaderItem = ({ text, description }) => {

    return (
        <Tooltip hasArrow label={description}>
            <div className="flex items-center gap-8">
                {text}
                <MdInfo />
            </div>
        </Tooltip>
    );
}

const OrderHistorySection = ({
    balances,
    orderHistories,
    chainServiceInfo,
    networkGasFee
}) => {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const [tabIndex, setTabIndex] = useState(0);
    const [beginDate, setBeginDate] = useState(new Date(Date.now() - 2592000000));
    const [endDate, setEndDate] = useState(endOfToday);
    const [sourceData, setSourceData] = useState(orderHistories)
    const [tableData, setTableData] = useState([]);
    const [dashboardTableData, setDashboardTableData] = useState([]);

    const [visibleZeroTokens, setVisibleZeroTokens] = useState(false);
    const [dashboardFilterKey, setDashboardFilterKey] = useState('');

    const [isWithdrawWindow, setIsWithdrawWindow] = useState(false);
    const [depositWithdrawModalVisible, setDepositWithdrawModalVisible] = useState(false);
    const [modalToken, setModalToken] = useState(null);
    const { signer } = useContext(Web3AuthContext);


    const handleRowClick = (record, index) => {

        if (!record.isMainRow) // don't need to do on fake rows
            return;

        if (record.isExpanded) {

            let newData = [
                ...tableData
            ];
            newData.splice(index + 1, 1);
            newData[index].isExpanded = false;
            setTableData(newData);

        } else {

            let newData = [
                ...tableData
            ];
            const newRecord = {
                ...record,
                isMainRow: false
            };
            newData[index].isExpanded = true;
            newData.splice(index + 1, 0, newRecord);
            setTableData(newData);
        }

    }

    const setFilteredTableData = (srcData) => {

        if (tabIndex === 1) { // TODO: I need to fix it
            setTableData(srcData.filter(order => {

                if (order.date < beginDate.getTime() || order.date > endDate.getTime())
                    return false;

                if (order.status === 'SETTLED' || order.status === 'CANCELED')
                    return false;

                return true;
            }));

        } else if (tabIndex === 2) {
            setTableData(srcData.filter(order => {

                if (order.date < beginDate.getTime() || order.date > endDate.getTime())
                    return false;

                if (order.status === 'SETTLED' || order.status === 'CANCELED')
                    return true;

                return false;
            }));
        }

    }

    useEffect(() => {
        setFilteredTableData(sourceData);
    }, [beginDate, endDate, tabIndex, orderHistories]);

    useEffect(() => {
        setSourceData(orderHistories);
        orderHistories = orderHistories.sort((a, b) => a.date < b.date ? 1 : -1);
        setFilteredTableData(orderHistories);
    }, [orderHistories]);

    useEffect(() => {
        const tokens = [];
        Object.keys(balances).map(symbol => {

            if (symbol.toLowerCase().indexOf(dashboardFilterKey.toLowerCase()) < 0)
                return;

            const balance = parseFloat(balances[symbol].contract) +
                parseFloat(balances[symbol].wallet) +
                parseFloat(balances[symbol].reserved) +
                parseFloat(balances[symbol].tradable);

            if (!visibleZeroTokens && balance <= 0)
                return;

            tokens.push({
                symbol,
                contract: formatNumberByFrac(balances[symbol].contract, 5),
                wallet: formatNumberByFrac(balances[symbol].wallet, 5),
                reserved: formatNumberByFrac(balances[symbol].reserved, 5),
                tradable: formatNumberByFrac(balances[symbol].tradable, 5)
            })
        })

        setDashboardTableData(tokens);
        console.log("setDashboardTableData", tokens)
    }, [balances, visibleZeroTokens, dashboardFilterKey]);



    const dashboardColumns = useMemo(() => ([
        {
            title: <HeaderItem text={"Token"} description={'The Token list refers to the name of a token/coin belonging to that crypto project, along with its logo. In certain instances, assets can differ in name in relation to the project, depending on which chain they are using. For example, ETH on the BSC network is WETH, and similarly with BNB.'} />,
            render: (text, record) => {
                return (
                    <div className={'token-header'}>
                        <img width="27"
                            height="27"
                            src={getAssetIconUrlBySymbolName(record.symbol)}
                        />
                        <div className="symbol">{record.symbol}</div>
                    </div>
                )
            }
        },
        {
            title: <HeaderItem text={"Wallet"} description={'The Wallet column shows the funds available in your connected wallet for that particularcrypto asset.'} />,
            render: (text, record) => {
                return (
                    <div className="other-headers">
                        {record.wallet}
                    </div>
                )
            }
        },
        {
            title: <HeaderItem text={"Contract"} description={'The Contract section shows the amount of funds which you currently have deposited into thesmart contract to be able to carry out a trade.'} />,
            render: (text, record) => {
                return (
                    <div className="other-headers">
                        {record.contract}
                    </div>
                )
            }
        },
        {
            title: <HeaderItem text={"Available"} description={'When creating a trade order, Dexfin locks part of the assets into the smart contract to ensurethe execution is completed successfully. The Available column displays the amount of fundsheld within the contract balance as well as part of the wallet balance that you approved. Thistotal is minus the locked assets which are required in the smart contract to execute a trade.The Available balance can also be referred to as the tradable balance, which is available totrade.'} />,
            render: (text, record) => {
                return (
                    <div className="other-headers">
                        {record.tradable}
                    </div>
                )
            }
        },
        {
            title: <HeaderItem text={"Locked"} description={'The Locked section shows your locked crypto assets in the smart contract open order thatare awaiting the trade to be carried out. You can unlock these assets simply by cancelingany relevant open orders on Dexfin.'} />,
            render: (text, record) => {
                return (
                    <div className="other-headers">
                        {record.reserved}
                    </div>
                )
            }
        },
        {
            title: (
                <div className="relative flex items-center gap-5 p-1">
                    <label className="relative flex items-center gap-2 text-gray-300">
                        <input
                            type="checkbox"
                            className="w-4 h-4 bg-gray-800 border-gray-600 rounded checked:bg-blue-500"
                            checked={!visibleZeroTokens}
                            onChange={(e) => setVisibleZeroTokens(!e.target.checked)}
                        />
                        Hide zero
                    </label>


                </div>
            ),

            className: 'dashboard-status-header',
            render: (text, record) => {
                return (
                    <div className='gap-8 flex-center'>
                        <Tooltip hasArrow label='Deposit'>
                            <Button className="dashboard-button" onClick={() => {
                                setIsWithdrawWindow(false);
                                setModalToken({
                                    symbol: record.symbol,
                                    balance: record,
                                })
                                setDepositWithdrawModalVisible(true);
                            }}>
                                <FaArrowUp />
                            </Button>
                        </Tooltip>

                        <Tooltip hasArrow label='Withdraw'>
                            <Button className="dashboard-button" onClick={() => {
                                setIsWithdrawWindow(true);
                                setModalToken({
                                    symbol: record.symbol,
                                    balance: record,
                                })
                                setDepositWithdrawModalVisible(true);
                            }}>
                                <FaArrowDown />
                            </Button>
                        </Tooltip>
                    </div>
                )
            }

        },
        {
            title:(
                <div className="relative flex-1">
                <CustomizedInput
                    hasRightElement={true}
                    rightElement={<BiSearch />}
                    placeholder={'Search'}
                    value={dashboardFilterKey}
                    setValue={setDashboardFilterKey}
                />
            </div>
            )
        }
    ]));

    return (
        <div className="relative w-full text-white bg-black glass">
            {/* Header Section */}
            <div className="">
                <div className="relative flex items-center justify-between px-4 py-2 glass">
                    {/* Tabs */}
                    <div className="relative flex px-4 space-x-1 glass">
                        {['Dashboard', 'Open Orders', 'Order history'].map((tab, idx) => (
                            <button
                                key={tab}
                                onClick={() => setTabIndex(idx)}
                                className={`px-4 py-2 rounded-md text-sm transition-colors duration-200 relative glass ${tabIndex === idx
                                    ? 'bg-gray-800 text-white '
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Date Selector */}
                    {tabIndex !== 0 && (
                        <div className="flex items-center space-x-4 text-gray-400 ">
                            <div className="relative flex items-center px-3 py-2 space-x-2 bg-gray-800 rounded-md glass">
                                <input
                                    type="date"
                                    value={beginDate.toISOString().split('T')[0]}
                                    onChange={(e) => setBeginDate(new Date(e.target.value))}
                                    className="text-gray-300 bg-transparent focus:outline-none"
                                />
                                <CalendarIcon className="w-4 h-4" />
                            </div>
                            <span>-</span>
                            <div className="flex items-center px-3 py-2 space-x-2 bg-gray-800 rounded-md glass">
                                <input
                                    type="date"
                                    value={endDate.toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        const date = new Date(e.target.value);
                                        date.setHours(23);
                                        date.setMinutes(59);
                                        setEndDate(date);
                                    }}
                                    className="text-gray-300 bg-transparent focus:outline-none"
                                />
                                <CalendarIcon className="w-4 h-4" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="px-3 py-4">
                {tabIndex === 0 ? (
                    // Dashboard Table
                    <div className="space-y-4">
                        <div className="grid grid-cols-7 gap-4 mb-4">
                            {dashboardColumns.map((col, idx) => (
                                <div key={idx} className="flex items-center space-x-1 text-gray-400 ">
                                    <span>{col.title}</span>
                                    {col.tooltip && (
                                        <span className="text-gray-500 cursor-help">ⓘ</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        {dashboardTableData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <BiMehBlank className="w-8 h-8 mb-2" />
                                <span>No tokens</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {dashboardTableData.map((row, idx) => (
                                    <div
                                        key={idx}
                                        className="grid grid-cols-5 gap-4 py-2 text-gray-300"
                                    >
                                        {dashboardColumns.map((col) => (
                                            <div key={col.key}>{row[col.key]}</div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Orders Table
                    <div className="w-full space-y-4">
                        <div className="grid grid-cols-11 gap-4 mb-4">
                            {mainColumns.map((col, idx) => (
                                <div key={idx} className="text-gray-400">
                                    {col.title}
                                </div>
                            ))}
                        </div>
                        {tableData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <BiMehBlank className="w-8 h-8 mb-2" />
                                <span>You have no orders.</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {tableData.map((row, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleRowClick(row, idx)}
                                        className={`grid grid-cols-10 gap-4 py-2 text-gray-300 cursor-pointer hover:bg-gray-800 rounded-md transition-colors duration-200 ${row.isMainRow ? 'main-row' : 'expanded-row bg-gray-800'
                                            }`}
                                    >
                                        {mainColumns.map((col) => (
                                            <div key={col.key}>{row[col.key]}</div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {depositWithdrawModalVisible && modalToken && (
                <DepositWithdrawModal
                    unit={unit}
                    isWithdrawWindow={isWithdrawWindow}
                    signer={signer}
                    networkFeeStr={`${networkGasFee} ${chainServiceInfo?.baseSymbol}`}
                    fromToken={modalToken}
                    open={depositWithdrawModalVisible}
                    setOpen={setDepositWithdrawModalVisible}
                />
            )}
        </div>
    );

}
export default OrderHistorySection;
