import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from 'next/image';
import Seo from './components/Seo';
import Header from './components/Header';
import Footer from './components/Footer';

const Home: NextPage = () => {

  const [mintNum, setMintNum] = useState(0);
  const [mintQuantity, setmintQuantity] = useState(1);
  const [disabledFlag, setDisabledFlag] = useState(false);
  const abi = [
    'function totalSupply() public view virtual override returns (uint256)',
    "function mint(uint _mintAmount) public payable",
  ]
  const contractAddress = "0x08e62C3CD353063a95817435e862658C8F3C7482"
  useEffect(() => {
    const setSaleInfo = async() =>{
      const provider = await new ethers.providers.Web3Provider((window as any).ethereum);
      const signer =  await provider.getSigner();
      const contract =await new ethers.Contract(contractAddress, abi, signer);

      try{
        const mintNumber = (await contract.totalSupply()).toString();
        console.log('mintNumber = ' + mintNumber);
        setMintNum(mintNumber);
      }catch(e){
        console.log(e);
      }
    };
    setSaleInfo();
  });

  // ミントボタン用
  function MintButton() {
    async function addChain() {
      try{
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }],
        });
        const provider = await new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        setDisabledFlag(true);
      } catch(e) {
        console.log(e);
      }
      try{
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x13881',
            chainName: 'Mumbai',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 80001,
            },
            rpcUrls: ['https://polygon-mumbai.infura.io/v3/23ea2d926731400885b17ff8ce0ebbc2'],
          }],
        });
        console.log('try');
        setDisabledFlag(true);
      }catch(Exeption){
        console.log('Ethereum already Connected');
        console.log('catch');
      }finally{
        console.log('finally');
      }
    }
    const mintQuantityPlus = async () =>{
      if(mintQuantity == 3){
        return;
      } else {
        setmintQuantity(mintQuantity + 1);
      }
    };

    const mintQuantityMinus = async () =>{
      if(mintQuantity == 1){
        return;
      } else {
        setmintQuantity(mintQuantity - 1);
      }
    };
    
    const nftMint = async() => {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      await provider.send('eth_requestAccounts', []);
      const tokenPrice = '0.01';
      const quantity = String(mintQuantity);
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try{
        await contract.mint(quantity,{value: ethers.utils.parseEther(tokenPrice),gasLimit: 91000});
        alert('Starting to execute a transaction');
      }catch(err: any) {
      // JSONへ変換
        const jsonData = JSON.stringify(err.reason);
        alert(jsonData);
      }
    };
    return <>
    <div className="bg-black pb-16 flex flex-wrap buttom justify-center">
      <div className='px-8 pt-8 lg:px-28 lg:py-28'>
        <Image className="min-w-full" src="/14.png" alt="Main Image" width={500} height={500}/>
      </div>
      <div className="m-12 lg:m-32 px-12 py-6 lg:pt-8 lg:px-20 border-2 bg-black text-center border-[#FFFFFF] bg-center bg-contain bg-no-repeat">
        <h1 className="text-2xl lg:text-4xl pt-2 lg:pt-4 lg:pb-6 text-white font-['Impact']">Show Mee Member NFT</h1>
        <h1 className="text-2xl lg:text-4xl pt-2 lg:pt-4 lg:pb-6 text-white font-['Impact']"> {mintNum} / 100</h1>
        <a className="text-2xl lg:text-4xl pt-2 lg:pt-8 lg:pb-8 text-white font-['Impact']">1</a><a className="text-2xl lg:text-3xl pt-2 lg:pt-8 lg:pb-8 text-[#99CDDB] font-['Impact'] ">MAX</a><br/>
        
        { (!disabledFlag) && <button type="button" className="text-xl lg:text-2xl py-1 lg:py-3 px-12 lg:px-24 inline-flex justify-center items-center gap-2 rounded-full border border-transparent
        bg-[#FFFFFF] border-yellow-200 font-['Impact'] text-[#99CDDB] hover:yellow-500 hover:bg-[#99CDDB] hover:text-[#FFFFFF] hover:border-[#FFFFFF] mt-20
          focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800" onClick={() => addChain()}>
        CONNECT WALLET</button>}
        { (disabledFlag) && <button type="button" className="text-xl lg:text-2xl py-1 lg:py-3 px-12 lg:px-24 inline-flex justify-center items-center gap-2 rounded-full border border-transparent
        bg-[#FFFFFF] border-yellow-200 font-['Impact'] text-[#99CDDB] hover:yellow-500 hover:bg-[#99CDDB] hover:text-[#FFFFFF] hover:border-[#FFFFFF]
          focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800" onClick={() => nftMint()}>
        MINT NOW</button>}
      </div>
    </div>
    </>
  }

  // ここからGPTコード記載

  const [nftList, setNftList] = useState([]);
  // NFT一覧を取得する関数
  const getNftList = async () => {
    const provider = await new ethers.providers.Web3Provider((window as any).ethereum);
    const contract = await new ethers.Contract(contractAddress, abi, provider);

    try {
      // コントラクトからNFT一覧を取得するメソッドを呼び出す
      const nftListData = await contract.getNftList(); // これはコントラクトの実際のメソッド名に置き換えてください
      setNftList(nftListData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // ページがマウントされたときにNFT一覧を取得
    getNftList();
  }, []); // 空の依存リストを指定して一度だけ実行

  // ... 既存のコード ...

  // NFT一覧を表示する部分
  const nftListItems = nftList.map((nft, index) => (
    <div key={index}>
      {/* NFT情報を表示するUI要素を作成 */}
      <p>NFT #{index + 1}: {nft.name}</p>
      <p>Owner: {nft.owner}</p>
      {/* 他のNFT情報をここに表示 */}
    </div>
  ));


  return (
    <div>
      <Seo
          pageTitle={'ETH MASKS'}
          pageDescription={'ETH MASKS'}
          pageImg={''}
          pageImgWidth={1920}
          pageImgHeight={1005}
      />
      <Header />
      <MintButton/>
  
      {/* NFT一覧を表示 */}
      {nftListItems}
  
      <Footer />
    </div>
  );
};

export default Home;
