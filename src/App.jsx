// import { useEffect } from "react";
import { useState } from "react";

import Web3 from "web3";
import {
    CONTRACT_ABI,
    CONTRACT_ADDRESS,
    NFT_ABI,
    NFT_ADDRESS,
} from "./web3.config";

const web3 = new Web3(window.ethereum);

//컨트랙트 소통할 부분
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
const nftContract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);

function App() {
    /*이더리움 함수를 확인하기 위해서 사용했었음.
    useEffect(() => {
        console.log(window.ethereum);
    }, []);

    */

    // useEffect(() => {
    //     // console.log(web3);
    //     console.log(contract);
    // }, []);

    const [account, setAccount] = useState("");
    const [myBalance, setMyBalance] = useState("");

    const onClickAccount = async () => {
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            // console.log(accounts);
            setAccount(accounts[0]);
        } catch (error) {
            console.error(error);
        }
    };

    //
    const onClickLogout = () => {
        setAccount("");
    };

    //스마트 컨트렉트를 해줘야 하기 때문에 비동기 함수로 만들어줘야한다.
    const onClickBalance = async () => {
        try {
            if (!account || !contract) return;

            const balance = await contract.methods.balanceOf(account).call();

            //const totalSupply = await contract.methods.totalSupply().call();
            //console.log(totalSupply);

            // console.log(balance);
            // setMyBalance(balance);
            setMyBalance(web3.utils.fromWei(balance));
        } catch (error) {
            console.error(error);
        }
    };

    const onClickMint = async () => {
        try {
            const result = await nftContract.methods
                .mintNft(
                    "https://gateway.pinata.cloud/ipfs/QmWQcX3JhoxgjCGgXEcbKCtd5GM75Q5T58hsUQsHAv6yH7"
                )
                .send({
                    from: account,
                });

            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="bg-red-100 min-h-screen flex justify-center items-center">
            {account ? (
                <div>
                    <div className="text-main font-semibold text-2xl">
                        {account.substring(0, 4)}...
                        {account.substring(account.length - 4)}
                        <button
                            className="ml-4 btn-style"
                            onClick={onClickLogout}
                        >
                            로그아웃
                        </button>
                    </div>
                    <div className="flex items-center mt-4">
                        {myBalance && <div>{myBalance} tMatic</div>}
                        <button
                            className="ml-2 btn-style"
                            onClick={onClickBalance}
                        >
                            잔액 조회
                        </button>
                    </div>
                    <div className="flex items-center mt-4">
                        <button
                            className="ml-2 btn-style"
                            onClick={onClickMint}
                        >
                            민팅
                        </button>
                    </div>
                </div>
            ) : (
                <button className="btn-style" onClick={onClickAccount}>
                    <img
                        className="w-12"
                        src={`${process.env.PUBLIC_URL}/images/metamask.png`}
                    />
                </button>
            )}
        </div>
    );
}

export default App;
