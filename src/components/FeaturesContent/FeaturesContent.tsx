import React, { useEffect, useState } from "react";
import styles from './FeaturesContent.module.css';
import Image from "next/image";
import imgFirstSection from "@/src/assets/jw.jpg";
import imgSecondSection from "@/src/assets/bd.jpg";


export default function FeaturesContent() {

  const [selectedSection, setSelectedSection] = useState(1);
  const [selectedSectionImage, setSelectedSectionImage] = useState(imgFirstSection);

  useEffect(()=>{
    switch(selectedSection){
      case 1:
        setSelectedSectionImage(imgFirstSection);
        break;
      case 2:
        setSelectedSectionImage(imgSecondSection);
        break;
      default:
        setSelectedSectionImage(imgFirstSection);
        break;
    }
  },[selectedSection])

  const handleChangeSection = (sectionNumber:number) => {
    setSelectedSection(sectionNumber);
  }


  return (
          <>
            <div className={styles.mainContainer}>
                <div className={styles.textContainer}>
                    <div className={styles.buttonContainer}>
                        <button onClick={()=>handleChangeSection(1)} className={selectedSection===1?styles.activeSection:styles.inactiveSection}>
                            <h3>
                                <div className={styles.titleContainer}>
                                    <span className={selectedSection===1?styles.activeTitleText:styles.inactiveTitleText}>
                                        Payroll
                                    </span>
                                </div>
                            </h3>
                            <p className={styles.contentText}>
                              Keep track of everyone&apos;s salaries and whether or not they&apos;ve been paid. Direct deposit not supported.
                            </p>
                        </button>
                        <button onClick={()=>handleChangeSection(2)} className={selectedSection===2?styles.activeSection:styles.inactiveSection}>
                            <h3>
                                <div className={styles.titleContainer}>
                                    <span className={selectedSection===2?styles.activeTitleText:styles.inactiveTitleText}>
                                      Claim expenses
                                    </span>
                                </div>
                            </h3>
                            <p className={styles.contentText}>
                              All of your receipts organized into one place, as long as you don&apos;t mind typing in the data by hand.
                            </p>
                        </button>
                    </div>
                </div>
                <div className={selectedSection === 1 ? styles.activeSectionMobileTextContainer : styles.inactiveSectionMobileTextContainer}>
                  <div className={styles.mobileTitleContainer}>
                    <p className={styles.mobileContentText}>
                      Keep track of everyone&apos;s salaries and whether or not they&apos;ve been paid. Direct deposit not supported.
                    </p>
                  </div>
                </div>
                <div className={selectedSection === 2 ? styles.activeSectionMobileTextContainer : styles.inactiveSectionMobileTextContainer}>
                  <div className={styles.mobileTitleContainer}>
                    <p className={styles.mobileContentText}>
                      All of your receipts organized into one place, as long as you don&apos;t mind typing in the data by hand.
                    </p>
                  </div>
                </div>
                <div className={styles.imgContainer}>  
                  <Image className={styles.img} src={selectedSectionImage}></Image>
                </div>
            </div>
          </>
        )
}
